
import {benevCssText, topNav} from "@benev/web/ssg"
import {template, html, socialCard} from "@e280/scute"
import {asset} from "../assets.js"

export default template(import.meta.url, async orb => html`
	<!doctype html>
	<html benev>
		<head>
			<meta charset="utf-8"/>
			<meta name="viewport" content="width=device-width,initial-scale=1"/>
			<meta name="darkreader-lock"/>

			<title>falrysk</title>
			<link rel="icon" href="${asset("favicon.png")}"/>
			<script type="module" src="${orb.hashurl("main.bundle.min.js")}"></script>

			<style data-theme>
				@layer benev, vars, x, app;
				@layer app {
					:root {
						color: #aaa;
						background: #000;
					}
				}
				${html.raw(benevCssText)}
				${orb.inject("css/vars.css")}
				${orb.inject("css/x.css")}
				${orb.inject("css/app.css")}
			</style>

			${socialCard({
				title: "falrysk",
				description: "a world of great wonders, and great dangers",
				themeColor: "#f90",
			})}
		</head>
		<body>
			<benev-menu>
				<p>this is the benev menu</p>
			</benev-menu>

			<benev-header>
				${topNav("games")}
			</benev-header>

			<benev-loader>
				<main style="${`--bg-url: url('${asset("bg.webp")}')`}">
					<section class=plate benev-slice>
						<header>
							<h1>falrysk</h1>
							<p class=version>v${orb.packageVersion()}</p>
						</header>
						<a benev-button=juicy href="/#/play">new game</a>
					</section>

					<benev-footer>
						<a href="https://discord.gg/BnZx2utdev">discord</a>
						<a href="https://github.com/benev-gg/falrysk">github</a>
					</benev-footer>
				</main>
			</benev-loader>
		</body>
	</html>
`)

