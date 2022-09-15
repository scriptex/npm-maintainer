[![Github Build](https://github.com/scriptex/npm-maintainer/workflows/Build/badge.svg)](https://github.com/scriptex/npm-maintainer/actions?query=workflow%3ABuild)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/34d3d75710534dc6a38c3584a1dcd068)](https://www.codacy.com/gh/scriptex/npm-maintainer/dashboard?utm_source=github.com&utm_medium=referral&utm_content=scriptex/npm-maintainer&utm_campaign=Badge_Grade)
[![Codebeat Badge](https://codebeat.co/badges/d765a4c8-2c0e-44f2-89c3-fa364fdc14e6)](https://codebeat.co/projects/github-com-scriptex-npm-maintainer-master)
[![CodeFactor Badge](https://www.codefactor.io/repository/github/scriptex/npm-maintainer/badge)](https://www.codefactor.io/repository/github/scriptex/npm-maintainer)
[![DeepScan grade](https://deepscan.io/api/teams/3574/projects/5257/branches/40799/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3574&pid=5257&bid=40799)
[![Analytics](https://ga-beacon-361907.ew.r.appspot.com/UA-83446952-1/github.com/scriptex/npm-maintainer/README.md?pixel)](https://github.com/scriptex/npm-maintainer/)

# NPM Maintainer

> Statistics for a NPM user

A web component which shows various statistics for a user in the NPM database.

## Visitor stats

![GitHub stars](https://img.shields.io/github/stars/scriptex/npm-maintainer?style=social)
![GitHub forks](https://img.shields.io/github/forks/scriptex/npm-maintainer?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/scriptex/npm-maintainer?style=social)
![GitHub followers](https://img.shields.io/github/followers/scriptex?style=social)

## Code stats

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/scriptex/npm-maintainer)
![GitHub repo size](https://img.shields.io/github/repo-size/scriptex/npm-maintainer?style=plastic)
![GitHub language count](https://img.shields.io/github/languages/count/scriptex/npm-maintainer?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/scriptex/npm-maintainer?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/scriptex/npm-maintainer?style=plastic)

## Install

```sh
npm i npm-maintainer

#or

yarn add npm-maintainer
```

## Usage

```js
// In your JS entrypoint
import 'npm-maintainer';
```

```html
<!-- In your HTML file -->

<npm-maintainer
	user="scriptex"
	error="An unknown error occurred. Please try again later."
	loading="Loading data from NPM..."
></npm-maintainer>
```

## Attributes

| Name      | Type     | Required | Default               | Description                        |
| --------- | -------- | -------- | --------------------- | ---------------------------------- |
| `user`    | `string` | true     | ''                    | The user name from NPM             |
| `error`   | `string` | false    | 'Error loading data.' | Message shown when an error occurs |
| `loading` | `string` | false    | 'Loading data...'     | Message shown when loading data    |

## Styling

The `npm-maintainer` Web Component utilizes the [`::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) pseudo-element. In order to add custom styles, you should use the corresponding parts of the components:

-   `error` - The element which shows the error message
-   `loading` - The element which shows the loading message
-   `content` - The element which shows the data table
-   `table` - The <table> itself
-   `thead` - The <thead> element
-   `thead`-row - The <tr> inside the <thead> element
-   `tbody` - The <tbody> element
-   `tbody`-row - The <tr> inside the <tbody> element
-   `th` - the <th> elements
-   `td` - the <td> elements

Here is an example:

```css
npm-maintainer {
	display: block;
}

npm-maintainer::part(error),
npm-maintainer::part(loading) {
	text-align: center;
	min-height: 75vh;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
}

npm-maintainer::part(error) {
	color: red;
}

npm-maintainer::part(table) {
	width: 100%;
	border-collapse: collapse;
	border-spacing: 0;
}

npm-maintainer::part(th),
npm-maintainer::part(td) {
	padding: 0.25rem;
	border: 1px solid;
}

npm-maintainer::part(link) {
	color: inherit;
	text-decoration: underline;
}

npm-maintainer::part(link):hover {
	text-decoration: none;
}
```

## LICENSE

MIT

<div align="center">Connect with me:</div>

<br />

<div align="center">
	<a href="https://atanas.info">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/logo.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="mailto:hi@atanas.info">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/email.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://www.linkedin.com/in/scriptex/">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/linkedin.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://github.com/scriptex">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/github.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://gitlab.com/scriptex">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/gitlab.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://twitter.com/scriptexbg">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/twitter.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://www.npmjs.com/~scriptex">
		<img src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/npm.svg" height="20" alt="" />
	</a>
	&nbsp;
	<a href="https://www.youtube.com/user/scriptex">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/youtube.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://stackoverflow.com/users/4140082/atanas-atanasov">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/stackoverflow.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://codepen.io/scriptex/">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/codepen.svg"
			width="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://profile.codersrank.io/user/scriptex">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/codersrank.svg"
			height="20"
			alt=""
		/>
	</a>
	&nbsp;
	<a href="https://linktr.ee/scriptex">
		<img
			src="https://raw.githubusercontent.com/scriptex/socials/master/styled-assets/linktree.svg"
			height="20"
			alt=""
		/>
	</a>
</div>

---

<div align="center">
	Support and sponsor my work:
	<br />
	<br />
	<a
		href="https://twitter.com/intent/tweet?text=Checkout%20this%20awesome%20developer%20profile%3A&url=https%3A%2F%2Fgithub.com%2Fscriptex&via=scriptexbg&hashtags=software%2Cgithub%2Ccode%2Cawesome"
		title="Tweet"
	>
		<img src="https://img.shields.io/badge/Tweet-Share_my_profile-blue.svg?logo=twitter&color=38A1F3" />
	</a>
	<a href="https://paypal.me/scriptex" title="Donate on Paypal">
		<img src="https://img.shields.io/badge/Donate-Support_me_on_PayPal-blue.svg?logo=paypal&color=222d65" />
	</a>
	<a href="https://revolut.me/scriptex" title="Donate on Revolut">
		<img
			src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/revolut.json"
		/>
	</a>
	<a href="https://patreon.com/atanas" title="Become a Patron">
		<img
			src="https://img.shields.io/badge/Become_Patron-Support_me_on_Patreon-blue.svg?logo=patreon&color=e64413"
		/>
	</a>
	<a href="https://ko-fi.com/scriptex" title="Buy Me A Coffee">
		<img src="https://img.shields.io/badge/Donate-Buy%20me%20a%20coffee-yellow.svg?logo=ko-fi" />
	</a>
	<a href="https://liberapay.com/scriptex/donate" title="Donate on Liberapay">
		<img src="https://img.shields.io/liberapay/receives/scriptex?label=Donate%20on%20Liberapay&logo=liberapay" />
	</a>

    <a
    	href="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/bitcoin.json"
    	title="Donate Bitcoin"
    >
    	<img
    		src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/bitcoin.json"
    	/>
    </a>
    <a
    	href="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/etherium.json"
    	title="Donate Etherium"
    >
    	<img
    		src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/etherium.json"
    	/>
    </a>
    <a
    	href="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/shiba-inu.json"
    	title="Donate Shiba Inu"
    >
    	<img
    		src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/scriptex/scriptex/master/badges/shiba-inu.json"
    	/>
    </a>

</div>
````
