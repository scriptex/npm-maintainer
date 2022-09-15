type ApiResponse = {
	total: number;
	results: any[];
};

class NPMMaintainer extends HTMLElement {
	private SIZE = 250;
	private API_URL = 'https://api.npms.io/v2';
	private data: ApiResponse = {
		total: 0,
		results: []
	};
	private template: HTMLTemplateElement = document.createElement('template');

	private error = false;
	private loading = true;

	static get observedAttributes(): string[] {
		return ['user', 'error', 'loading'];
	}

	constructor() {
		super();

		this.render();
	}

	public async connectedCallback(): Promise<void> {
		const user = this.getAttribute('user');

		this.data = user ? await this.fetchData(user) : this.data;

		this.render();
	}

	private async fetch(args: string, options?: RequestInit): Promise<any> {
		return fetch(`${this.API_URL}${args}`, options)
			.then((r: Response) => r.json())
			.catch(() => {
				this.error = true;
			});
	}

	private async fetchData(user: string): Promise<any> {
		let from = 0;
		let total = 0;

		const limit = 250;
		const items: any[] = [];

		if (from === 0) {
			const response = await this.fetch(`/search?q=maintainer:${user}&size=250&from=${from}`);

			if (response.total <= limit) {
				return await this.build(response.results, response.total, user, from);
			}

			total = response.total;
			items.push(...response.results);
		}

		return await this.build(items, total, user, from);
	}

	private async build(items: any, total: any, user: string, from: number) {
		while (items.length < total) {
			from += 250;

			const next = await this.fetch(`/search?q=maintainer:${user}&size=250&from=${from}`);

			items.push(...next.results);
		}

		const copy = [...items];

		const namesArray = new Array(Math.ceil(items.length / this.SIZE)).fill('').map(_ => copy.splice(0, this.SIZE));

		const packagesDetails = namesArray.map(items => {
			return this.fetch(`/package/mget`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(items.map(item => item.package.name))
			});
		});

		const details = (await Promise.all(packagesDetails)).reduce((sum, current) => {
			return { ...sum, ...current };
		}, {});

		const results = Object.keys(details).reduce((result, key) => {
			const match = items.find((item: any) => item.package.name === key);

			result.push({
				...match,
				...details[key]
			});

			return result;
		}, [] as any);

		this.loading = false;

		return {
			total,
			results
		};
	}

	private render(): void {
		const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });

		shadowRoot.innerHTML = '';

		this.template.innerHTML = this.loading
			? `<div part="loading">${this.getAttribute('loading') || 'Loading data...'}</div>`
			: this.error
			? `<div part="error">${this.getAttribute('error') || 'Error loading data.'}</div>`
			: `<div part="content">${this.renderStats()}</div>`;

		shadowRoot.appendChild(this.template.content.cloneNode(true));
	}

	private renderStats(): string {
		const data = this.data.results.map((result: any) => ({
			name: result.package.name,
			stars: result.collected?.github?.starsCount || 0,
			issues: result.collected?.github?.issues?.openCount || 0,
			version: result.collected.metadata.version,
			downloads: result.collected.npm.downloads.reduce((result: any, item: any) => result + item.count, 0),
			description: result.package.description
		}));

		if (data.length === 0) {
			return '';
		}

		return `
<table part="table">
	<thead part="thead">
		<tr part="thead-row">
			${this.join(Object.keys(data[0]).map(column => `<th part="th">${column}</th>`))}
		</tr>
	</thead>
	<tbody part="tbody">
		${this.join(
			// prettier-ignore
			data.map((item: any) =>`<tr part="tbody-row">${this.join(Object.keys(item).map(key => `<td part="td">${key === 'name' ? this.renderLink(item[key]) : item[key]}</td>`))}</tr>`)
		)}
	</tbody>
</table>`;
	}

	private renderLink(value: string): string {
		return `<a rel="noopener noreferrer" part="link" href="${`https://npmjs.org/package/${value}`}" target="_blank">${value}</a>`;
	}

	private join(data: string[]): string {
		return data.join('\n');
	}
}

window.customElements.define('npm-maintainer', NPMMaintainer);
