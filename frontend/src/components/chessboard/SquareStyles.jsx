// Returns the CSS styles for each square based on game state.
export function getSquareStyles(game, selectedSquare, firstMove) {
    const styles = {};
    const history = game.history({ verbose: true });

    if (history.length > 0) {
        const lastMove = history[history.length - 1];
        addSquareStyles(styles, lastMove.from, 'var(--color-last-move)');
        addSquareStyles(styles, lastMove.to, 'var(--color-last-move)');
    } else if(firstMove) {
        addSquareStyles(styles, firstMove.slice(0, 2), 'var(--color-last-move)');
        addSquareStyles(styles, firstMove.slice(2, 4), 'var(--color-last-move)');
    }

    let kingSquare;

    if (game.isCheck()) {
        [kingSquare] = game.findPiece({ type: 'k', color: game.turn() });

        if (kingSquare) {
            addSquareStyles(
                styles,
                kingSquare,
                'radial-gradient(circle, var(--color-check) 50%, transparent 90%)'
            );
        }
    }

    if (selectedSquare) {
        const selectedBackground = selectedSquare === kingSquare
            ? 'radial-gradient(circle, transparent 40%, var(--color-selected) 100%)'
            : 'radial-gradient(circle, var(--color-selected) 100%, var(--color-selected) 100%)';

        addSquareStyles(styles, selectedSquare, selectedBackground);

        const moves = game.moves({
            square: selectedSquare,
            verbose: true,
        });

        moves.forEach((move) => {
            const background = move.captured
                ? 'radial-gradient(circle, transparent 80%, var(--color-capture) 80%)'
                : 'radial-gradient(circle, var(--color-legal-move) 20%, transparent 21%)';

            addSquareStyles(styles, move.to, background);
        });
    }

    return styles;
}

function addSquareStyles(styles, square, background) {
    if (styles[square]) {
        styles[square] = {
            background: `${background}, ${styles[square].background}`,
        };
    } else {
        styles[square] = { background };
    }
}
