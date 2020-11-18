type ApiResponse = {
	total: number;
	results: Array<Record<string, any>>;
};

class NPMUserStats extends HTMLElement {
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
		return ['user'];
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

		console.log(namesArray);

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
			? 'Fetching data...'
			: this.error
			? 'Error fetching data.'
			: `<div>${this.renderStats()}</div>`;

		shadowRoot.appendChild(this.template.content.cloneNode(true));
	}

	private renderStats(): string {
		const cols = ['Name', 'Popularity', 'Downloads', 'Interest', 'Dependents'];
		const names = this.data.results.map(({ package: { name } }) => name);

		console.log(this.data);

		return `
<table>
	<thead>
		<tr>
			${cols.map(name => `<th>${name}</th>`).join('\n')}
		</tr>
	</thead>
	<tbody>
	${names
		.map(
			name => `
		<tr>
			<td>
				<a href="${`https://npmjs.org/package/${name}`}" target="_blank">${name}</a>
			</td>
		</tr>
	`
		)
		.join('\n')}
	</tbody>
	</table>
`;
	}
}

window.customElements.define('npm-user-stats', NPMUserStats);
