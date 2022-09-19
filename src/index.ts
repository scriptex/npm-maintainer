type Commit = {
	to: string;
	from: string;
	count: number;
};

type Contributor = {
	username: string;
	commitsCount: number;
};

type Maintainer = {
	email: string;
	username: string;
};

type Repository = {
	url: string;
	type: string;
};

type Badge = {
	info: {
		type: string;
		service: string;
		modifiers: Record<string, string>;
	};
	urls: Record<string, string>;
};

type Score = {
	final: number;
	detail: {
		quality: number;
		popularity: number;
		maintenance: number;
	};
};

type NPMPackage = {
	score: Score;
	collected: {
		npm: {
			downloads: Commit[];
			starsCount: number;
		};
		github: {
			issues: {
				count: number;
				openCount: number;
				isDisabled: boolean;
				distribution: Record<number, number>;
			};
			commits: Commit[];
			homepage: string;
			forksCount: number;
			starsCount: number;
			contributors: Contributor[];
			subscribersCount: number;
		};
		source: {
			files: {
				testsSize: number;
				readmeSize: number;
				hasNpmIgnore: boolean;
			};
			badges: Badge[];
			linters: string[];
		};
		metadata: {
			date: string;
			name: string;
			links: Record<string, string>;
			scope: string;
			readme: string;
			license: string;
			version: string;
			keywords: string[];
			releases: Commit[];
			publisher: Maintainer;
			repository: Repository;
			description: string;
			maintainers: Maintainer[];
			devDependencies: Record<string, string>;
		};
	};
	analyzedAt: string;
	evaluation: {
		quality: {
			tests: number;
			health: number;
			branding: number;
			carefulness: number;
		};
		popularity: {
			downloadsCount: number;
			dependentsCount: number;
			communityInterest: number;
			downloadsAcceleration: number;
		};
		maintenance: {
			openIssues: number;
			commitsFrequency: number;
			releasesFrequency: number;
			issuesDistribution: number;
		};
	};
};

type Package = {
	package: {
		author: Record<string, string>;
		date: string;
		description: string;
		links: Record<string, string>;
		maintainers: Maintainer[];
		name: string;
		publisher: Maintainer;
		scope: string;
		version: string;
	};
	score: Score;
	searchScore: number;
};

type ApiResponse = {
	total: number;
	results: Package[];
};

type CombinedPackage = NPMPackage & Package;

type NPMMaintainerData = {
	total: number;
	results: CombinedPackage[];
};

class NPMMaintainer extends HTMLElement {
	private SIZE = 250;
	private API_URL = 'https://api.npms.io/v2';
	private data: NPMMaintainerData = {
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

	private async fetch(args: string, options?: RequestInit): Promise<ApiResponse> {
		return fetch(`${this.API_URL}${args}`, options)
			.then((r: Response) => r.json())
			.catch(() => {
				this.error = true;
				return [];
			});
	}

	private async fetchData(user: string): Promise<NPMMaintainerData> {
		let from = 0;
		let total = 0;

		const limit = 250;
		const items: Package[] = [];

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

	private async build(items: Package[], total: number, user: string, from: number) {
		while (items.length < total) {
			from += this.SIZE;

			const next = await this.fetch(`/search?q=maintainer:${user}&size=250&from=${from}`);

			items.push(...next.results);
		}

		const copy = [...items];

		const namesArray = new Array(Math.ceil(items.length / this.SIZE)).fill('').map(_ => copy.splice(0, this.SIZE));

		const packagesDetails = namesArray.map(items =>
			this.fetch(`/package/mget`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(items.map(item => item.package.name))
			})
		);

		const details: Record<string, NPMPackage> = (await Promise.all(packagesDetails)).reduce((sum, current) => {
			return { ...sum, ...current };
		}, {});

		const results = Object.keys(details).reduce((result, key) => {
			const match = items.find((item: Package) => item.package.name === key);

			result.push({
				...match,
				...details[key]
			} as CombinedPackage);

			return result;
		}, [] as CombinedPackage[]);

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
		const data: Record<string, string | number>[] = this.data.results
			.map((result: CombinedPackage) => ({
				name: result.package.name,
				stars: result.collected?.github?.starsCount || 0,
				issues: result.collected?.github?.issues?.openCount || 0,
				version: result.collected?.metadata?.version || '',
				// prettier-ignore
				downloads: result.collected?.npm?.downloads?.reduce((result: number, item: Commit) => result + item.count, 0) || 0,
				description: result.package.description
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		if (data.length === 0) {
			return '';
		}

		return `
<table part="table">
	<thead part="thead">
		<tr part="thead-row">
			${this.join(Object.keys(data[0]).map(this.renderHeader))}
		</tr>
	</thead>
	<tbody part="tbody">
		${this.join(data.map(this.renderRow))}
	</tbody>
</table>`;
	}

	private renderHeader(text: string): string {
		return `<th part="th">${text}</th>`;
	}

	private renderCell(key: string, data: Record<string, string | number>): string {
		return `<td part="td">${key === 'name' ? this.renderLink(data[key]) : data[key]}</td>`;
	}

	private renderRow = (data: Record<string, string | number>): string => {
		return `<tr part="tbody-row">${this.join(Object.keys(data).map(key => this.renderCell(key, data)))}</tr>`;
	};

	private renderLink(value: string | number): string {
		const url = `https://npmjs.org/package/${value}`;

		return `<a rel="noopener noreferrer" part="link" href="${url}" target="_blank">${value}</a>`;
	}

	private join(data: string[]): string {
		return data.join('\n');
	}
}

window.customElements.define('npm-maintainer', NPMMaintainer);
