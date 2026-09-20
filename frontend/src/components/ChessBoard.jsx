import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

export function ChessBoard() {
    const [game, setGame] = useState(() => new Chess());

    // Handles piece drop events
    function onPieceDrop({ sourceSquare, targetSquare }) {

        // If the piece was not dropped on square, the move is not accepted.
        if (!sourceSquare || !targetSquare) {
            return false;
        }

        return makeMove(sourceSquare, targetSquare); // Try to make the move and return the result.
    }
    
    // Attempts to make a move and returns whether it was successful.
    function makeMove(sourceSquare, targetSquare) {

        const gameCopy = new Chess(game.fen()); // Make copy of the current game
        
        try {
            gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            setGame(gameCopy);
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
                onPieceDrop
            }}  
        />
    );
};

