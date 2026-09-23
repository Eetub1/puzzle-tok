import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import './ChessBoard.css';
import { PromotionChooser } from './PromotionChooser.jsx';
import './SquareStyles.css';
import { getSquareStyles } from './SquareStyles.jsx';

// ChessBoard component, renders the chessboard and handles game logic
export function ChessBoard() {
    const [game, setGame] = useState(() => new Chess());
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [gameover, setGameover] = useState(false);
    const [pendingPromotion, setPendingPromotion] = useState(null);

    // Completes pawn promotion and make move
    function completePromotion(promotionPiece) {
       if (!pendingPromotion) return;
       makeMove(pendingPromotion.from, pendingPromotion.to, promotionPiece);
    }

    // Determines if the move is pawn promotion
    function isPromotionMove(sourceSquare, targetSquare) {
        const piece = game.get(sourceSquare);
        if (!piece || piece.type !== 'p') {
            return false; // Not pawn or piece doesn't exist
        }
        const targetRank = targetSquare[1]; // 1 is first target square.
        // Is pawn moving last rank for its color
        return (piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1'); 
    }

    // Is move legal
    function isLegalMove(sourceSquare, targetSquare) {
        const legalMoves = game.moves({ square: sourceSquare, verbose: true });
        return legalMoves.some(({ to }) => to === targetSquare);
    }

    // Handles piece drop events
    function onPieceDrop({ sourceSquare, targetSquare }) {
        // If the piece was not dropped on square, the move is not accepted.
        if (!sourceSquare || !targetSquare || pendingPromotion) {
            return false;
        }
        // Check if move is promotion move and if it is legal
        if (isPromotionMove(sourceSquare, targetSquare) && isLegalMove(sourceSquare, targetSquare)) {
            setPendingPromotion({ from: sourceSquare, to: targetSquare, color: game.turn() });
            return true;
        }
        return makeMove(sourceSquare, targetSquare); // Try to make the move and return the result.
    }

    // Handles square click events
    function onSquareClick({ square }) {
        if(gameover || pendingPromotion) {
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

        // Check if move is a promotion move and if it is legal
        if (isPromotionMove(selectedSquare, square) && isLegalMove(selectedSquare, square)) {
            setPendingPromotion({ from: selectedSquare, to: square, color: game.turn() });
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
    function makeMove(sourceSquare, targetSquare, promotionPiece) {

        const gameCopy = new Chess(game.fen()); // Make copy of the current game
        
        try {
            gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: promotionPiece, // Your chosen promotion piece ('q', 'r', 'b', 'n')
            });
            setPendingPromotion(null);
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
        if(gameover || pendingPromotion) {
            return false;
        }
        return piece && piece.color === game.turn();
    }

    return (
        //Render the chessboard with handlers.
        <div className="chessboard-container">
            <Chessboard
                options={{
                    position: game.fen(), // FEN representing current game state
                    onPieceDrag, // Handle piece drag events
                    onPieceDrop,  // Handle piece drop events
                    onSquareClick, // Handle square click events
                    canDragPiece,  // Determine if piece can be dragged
                    squareStyles: getSquareStyles(game, selectedSquare), // Apply styles to squares
                }}  
            />
            <PromotionChooser
                pendingPromotion={pendingPromotion}
                onSelect={completePromotion}
            />
        </div>
        
    );
};

