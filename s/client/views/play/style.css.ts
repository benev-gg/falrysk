
import {css} from "lit"
export default css`

:host {
	display: block;
	position: absolute;
	inset: 0;
}

.shell {
	display: flex;
	height: 100%;
	gap: 0.2em;
}

.perspective {
	position: relative;
	flex: 1 1 0;

	&[data-drop]::before {
		pointer-events: none;
		content: "";
		display: block;
		z-index: 1;
		position: absolute;
		inset: 0;
		background: #0ff4;
		border: 0.5em dashed #fff;
	}
}

canvas {
	display: block;
	width: 100%;
	height: 100%;
	background: #000;

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

