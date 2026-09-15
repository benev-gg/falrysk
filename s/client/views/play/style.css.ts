
import {css} from "lit"
export default css`

:host {
	display: block;
	position: absolute;
	inset: 0;
}

.shell {
	display: flex;
	width: 100%;
	height: 100%;
	gap: 0.2em;
}

canvas {
	display: block;
	flex: 1 1 0;
	background: #000;
	min-width: 0;
	min-height: 0;

	&:focus {
		outline: none;
	}
}

.stats {
	pointer-events: none;
	position: absolute;
	top: 0;
	right: 0;

	opacity: 0.4;
	padding: 0 var(--benev-pad);

	font-size: 0.8em;
	font-family: monospace;
	font-weight: bold;

	background: #0008;
	text-shadow: none;
	border-radius: 0 0 var(--benev-round) 0;
}

`

