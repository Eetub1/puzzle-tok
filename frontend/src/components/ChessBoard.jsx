import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

export function ChessBoard() {
    const [game, setGame] = useState(() => new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);

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
            return true;

        } catch {
            return false;
        }
    }

    
    return (
        // Render the chessboard with handlers.
        <Chessboard
            options={{
                position: game.fen(), // FEN representing current game state
                onPieceDrop, 
                onSquareClick, 
                // Highlight the selected square 
                squareStyles: selectedSquare ? { [selectedSquare]: { background: 'rgba(255, 255, 0, 0.5)' } } : {},
            }}  
        />
    );
};

