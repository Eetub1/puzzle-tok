import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

export function ChessBoard() {
    const [game, setGame] = useState(() => new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [gameover, setGameover] = useState(false);

    // Handles piece drop events
    function onPieceDrop({ sourceSquare, targetSquare }) {

        // If the piece was not dropped on square, the move is not accepted.
        if (!sourceSquare || !targetSquare) {
            return false;
        }

        return makeMove(sourceSquare, targetSquare); // Try to make the move and return the result.
    }

    // Handles square click events
    function onSquareClick({ square }) {
        if(gameover) {
            return;
        }
        // No square is selected yet -> select this one
        if (!selectedSquare) {
            const piece = game.get(square);

            // Select only pieces with the current turn's color
            if (piece && piece.color === game.turn()) {
                setSelectedSquare(square);
            }

            return;
        }

        // Clicked the same square -> remove selection
        if (selectedSquare === square) {
            setSelectedSquare(null);
            return;
        }

        // Try to make a move
        const moveSuccessful = makeMove(selectedSquare, square);

        // If the move was not successful, check if another piece of the same color was selected
        if (!moveSuccessful) {
            const piece = game.get(square);

            if (piece && piece.color === game.turn()) {
                setSelectedSquare(square);
            } else {
                setSelectedSquare(null);
            }
        }
    }

    // Handles piece drag events
    function onPieceDrag({ square }) {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
        }
    }
    
    // Attempts to make a move and returns whether it was successful.
    function makeMove(sourceSquare, targetSquare) {

        const gameCopy = new Chess(game.fen()); // Make copy of the current game
        
        try {
            gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', // Always promote to queen TODO: Add UI for promotion choice
            });

            setGame(gameCopy);
            setSelectedSquare(null);
            if (gameCopy.isGameOver()) {
                setGameover(true);
            }
            return true;

        } catch {
            return false;
        }
    }

    // Determines if a piece can be dragged from the given square
    function canDragPiece({ square }) {
        const piece = game.get(square);
        if(gameover) {
            return false;
        }
        return piece && piece.color === game.turn();
    }

    // Returns the styles for each square 
    function getSquareStyles() {
        const styles = {}; // Object to hold styles for each square
        const history = game.history({ verbose: true }); // Get the move history in object
        if(history.length > 0) {
            const lastMove =history[history.length - 1];
            addSquareStyles(styles, lastMove.from, '#c8d67a');
            addSquareStyles(styles, lastMove.to, '#c8d67a');
        }
            
        

        // Highlight king in check
        if (game.isCheck()) {
            const [kingSquare] = game.findPiece({ type: 'k', color: game.turn() });
            if (kingSquare) styles[kingSquare] = { background: 'rgba(255, 0, 0, 0.4)' };
        }
        
        if(selectedSquare) {
            // Highlight the selected square
            addSquareStyles(styles, selectedSquare, 'rgba(255, 255, 0, 0.5)');
            // Get all possible moves from the selected square
            const moves = game.moves({
                square: selectedSquare,
                verbose: true, //moves in object format
            });
            // Highlight all possible target squares for selected piece
            moves.forEach((move) => {
                // If possible move captures piece, highlight with different style
                if(move.captured) {
                    addSquareStyles(styles, move.to, 'radial-gradient(circle, transparent 80%, rgba(255, 255, 0, 0.5) 80%)');
                } else { 
                    addSquareStyles(styles, move.to, 'radial-gradient(circle, rgba(0, 0, 0, 0.35) 20%, transparent 21%)');
                };
            });
        }

        return styles;
    }

    // Adds background style for given square in styles object
    function addSquareStyles(styles, square, background) {
        // If square already has style, combine new background with existing one
        if(styles[square]) {
            const existing = styles[square].background;
            styles[square] = { background: `${background}, ${existing}` };
        }
        else {
            styles[square] = { background };
        }
    }


    
    return (
        // Render the chessboard with handlers.
        <Chessboard
            options={{
                position: game.fen(), // FEN representing current game state
                onPieceDrag, // Handle piece drag events
                onPieceDrop,  // Handle piece drop events
                onSquareClick, // Handle square click events
                canDragPiece,  // Determine if piece can be dragged
                squareStyles: getSquareStyles(), // Apply styles to squares
            }}  
        />
    );
};

