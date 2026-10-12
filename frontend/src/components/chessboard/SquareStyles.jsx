// Returns the CSS styles for each square based on game state.
export function getSquareStyles(game, selectedSquare, lastMove, hintSquare, hoveredSquare) {
	const styles = {}
	const history = game.history({ verbose: true })

	if (history.length > 0) {
		const lastMove = history[history.length - 1]
		addSquareStyles(styles, lastMove.from, 'var(--chessboard-color-last-move)')
		addSquareStyles(styles, lastMove.to, 'var(--chessboard-color-last-move)')
	} else if(lastMove) {
		addSquareStyles(styles, lastMove.slice(0, 2), 'var(--chessboard-color-last-move)')
		addSquareStyles(styles, lastMove.slice(2, 4), 'var(--chessboard-color-last-move)')
	}

	let kingSquare

	if (game.isCheck()) {
		[kingSquare] = game.findPiece({ type: 'k', color: game.turn() })

		if (kingSquare) {
			addSquareStyles(
				styles,
				kingSquare,
				'radial-gradient(circle, var(--chessboard-color-check) 50%, transparent 90%)'
			)
		}
	}

	if (selectedSquare) {
		const selectedBackground = selectedSquare === kingSquare
			? 'radial-gradient(circle, transparent 40%, var(--chessboard-color-selected) 100%)'
			: 'radial-gradient(var(--chessboard-color-selected) 100%)'

		addSquareStyles(styles, selectedSquare, selectedBackground)

		const moves = game.moves({
			square: selectedSquare,
			verbose: true,
		})

		moves.forEach((move) => {
			const background = move.captured
				? 'radial-gradient(circle, transparent 80%, var(--chessboard-color-capture) 80%)'
				: 'radial-gradient(circle, var(--chessboard-color-legal-move) 20%, transparent 21%)'

			addSquareStyles(styles, move.to, background)
		})
	}

	if (hintSquare) {
		const background = 'radial-gradient(var(--chessboard-color-hint))'
		addSquareStyles(styles, hintSquare, background)
	}

	if (hoveredSquare) {
		addSquareStyles(styles, hoveredSquare, 'radial-gradient(var(--chessboard-color-drag-hover))')
	}

	return styles
}

function addSquareStyles(styles, square, background) {
	if (styles[square]) {
		styles[square] = {
			background: `${background}, ${styles[square].background}`,
		}
	} else {
		styles[square] = { background }
	}
}
