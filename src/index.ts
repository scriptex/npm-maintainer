type ApiResponse = {
	total: number;
	results: Array<Record<string, any>>;
};

class NPMUserStats extends HTMLElement {
	private ENDPOINT = 'https://api.npms.io/v2/search';

	private data: ApiResponse = {
		total: 0,
		results: []
	};

	private styleEl: HTMLStyleElement = document.createElement('style');
	private template: HTMLTemplateElement = document.createElement('template');

	private error = false;
	private loading = true;

	static get observedAttributes(): string[] {
		return ['user', 'style'];
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

	private async fetch(user: string, from: number): Promise<ApiResponse> {
		return fetch(`${this.ENDPOINT}?q=maintainer:${user}&size=250&from=${from}`)
			.then((r: Response) => r.json())
			.catch(() => {
				this.error = true;
			});
	}

	private async fetchData(user: string): Promise<ApiResponse> {
		let from = 0;
		let total = 0;

		const limit = 250;
		const results = [];

		if (from === 0) {
			const response = await this.fetch(user, from);

			if (response.total <= limit) {
				return response;
			}

			total = response.total;
			results.push(...response.results);
		}

		while (results.length < total) {
			from += 250;

			const next = await this.fetch(user, from);

			results.push(...next.results);
		}

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

		shadowRoot.appendChild(this.styleEl.cloneNode(true));
		shadowRoot.appendChild(this.template.content.cloneNode(true));
	}

	private renderStats(): string {
		return `total: ${this.data.total}`;
	}
}

window.customElements.define('npm-user-stats', NPMUserStats);
