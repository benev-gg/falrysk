
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

	.noplayers {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.seat {
	position: relative;
	flex: 1 1 0;
	min-width: 0;
	min-height: 0;

	&[data-drop]::after {
		content: "";
		display: block;
		position: absolute;
		inset: 0;
		border: 0.25em dashed var(--drop);
		background: oklch(from var(--drop) l c h / 25%);
	}

	[view="loading"] {
		position: absolute;
		inset: 0;

		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 2em;
	}
}

canvas {
	display: block;
	position: relative;
	inset: 0;
	width: 100%;
	height: 100%;

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

