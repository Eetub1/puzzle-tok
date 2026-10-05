import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import './PuzzleBoard.css'
import { PromotionChooser } from './PromotionChooser.jsx'
import { getSquareStyles } from './SquareStyles.jsx'

// PuzzleBoard component that renders chessboard for given puzzle
const PuzzleBoard = forwardRef(function PuzzleBoard({puzzle, preview = false}, ref) {
	const [game, setGame] = useState(() => new Chess(puzzle.fen))
	const [puzzleMoveIndex, setPuzzleMoveIndex] = useState(0)
	const [puzzleStatus, setPuzzleStatus] = useState('playing')
	const [selectedSquare, setSelectedSquare] = useState(null)
	const [pendingPromotion, setPendingPromotion] = useState(null)
	const[lastMove, setLastMove] = useState(puzzle.lastMove)
	const [hintSquare, setHintSquare] = useState(null)
	const [hoveredSquare, setHoveredSquare] = useState(null)
	const [isDragging, setIsDragging] = useState(false)
	const [moveFeedback, setMoveFeedback] = useState(null)
	const [positions, setPositions] = useState([
		{
			fen: puzzle.fen,
			lastMove: puzzle.lastMove
		}
	])

	const puzzleMoves = puzzle.moves.split(' ') ?? []
	const playerColor = puzzle.fen.split(' ')[1] ?? 'w'


	// Use effect to handle computer moves based on puzzle solution
	useEffect(() => {
		if (preview || game.turn() === playerColor || puzzleStatus !== 'playing') {
			return
		}
		const nextMove = puzzleMoves[puzzleMoveIndex]
		if(!nextMove) {
			return
		}
		setTimeout(() => {
			computerMove(nextMove, 'Computer move failed')
		}, 700) // Delay computer move

	}, [game, puzzleMoveIndex, playerColor])

	// Move back in puzzle
	function moveBack() {
		if (puzzleMoveIndex <= 0) {
			return
		}
		const { fen, lastMove } = positions[puzzleMoveIndex - 1]
		const gameCopy = new Chess(fen)
		setLastMove(lastMove)
		setGame(gameCopy)
		setPuzzleMoveIndex(puzzleMoveIndex - 1)
		setSelectedSquare(null)
		setMoveFeedback(null)
		if (puzzleStatus !== 'solved') {
			setPuzzleStatus('viewing')
		}
	}

	// Move forward in puzzle
	function moveForward() {
		if (puzzleMoveIndex >= positions.length - 1) {
			return
		}
		const { fen, lastMove } = positions[puzzleMoveIndex + 1]
		const gameCopy = new Chess(fen)
		setLastMove(lastMove)
		setGame(gameCopy)
		setPuzzleMoveIndex(puzzleMoveIndex + 1)
		setSelectedSquare(null)
		setMoveFeedback(null)
		if (puzzleMoveIndex + 1 === positions.length - 1 && puzzleStatus !== 'solved') {
			setPuzzleStatus('playing')
		}
	}

	// Give hint for next move
	function giveHint() {
		if (puzzleStatus === 'solved') {
			return
		}
		const nextMove = puzzleMoves[puzzleMoveIndex]
		if(!nextMove) {
			return
		}
		const sourceSquare = nextMove.slice(0, 2)
		setHintSquare(sourceSquare)
		setMoveFeedback(null)
	}

	// Give solution for next move
	function giveSolution() {
		if (puzzleStatus === 'solved') {
			return
		}
		const nextMove = puzzleMoves[puzzleMoveIndex]
		if(!nextMove) {
			return
		}
		computerMove(nextMove, 'solution move failed')
		setPuzzleStatus('playing')
		if (puzzleMoveIndex + 1 >= puzzleMoves.length) {
			setPuzzleStatus('solved')
		}
		setHintSquare(null)
		setMoveFeedback(null)
	}

	// Expose methods to parent component: ChessReels
	useImperativeHandle(ref, () => ({
		moveBack,
		moveForward,
		giveHint,
		giveSolution,
	}))

	// Completes pawn promotion and make move
	function completePromotion(promotionPiece) {
		if (!pendingPromotion) return
		if(!makeMove(pendingPromotion.from, pendingPromotion.to, promotionPiece)) {
			setPendingPromotion(null)
		}
	}

	// Determines if the move is pawn promotion
	function isPromotionMove(sourceSquare, targetSquare) {
		const piece = game.get(sourceSquare)
		if (!piece || piece.type !== 'p') {
			return false // Not pawn or piece doesn't exist
		}
		const targetRank = targetSquare[1] // 1 is first target square.
		// Is pawn moving last rank for its color
		return (piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1')
	}

	// Is move legal
	function isLegalMove(sourceSquare, targetSquare) {
		const legalMoves = game.moves({ square: sourceSquare, verbose: true })
		return legalMoves.some(({ to }) => to === targetSquare)
	}

	// Handles piece drop events
	function onPieceDrop({ sourceSquare, targetSquare }) {
		setIsDragging(false)
		setHoveredSquare(null)

		if (preview || !sourceSquare || !targetSquare || pendingPromotion || puzzleStatus !== 'playing') {
			return false
		}
		// Check if move is promotion move and if it is legal
		if (isPromotionMove(sourceSquare, targetSquare) && isLegalMove(sourceSquare, targetSquare)) {
			setPendingPromotion({ from: sourceSquare, to: targetSquare, color: game.turn() })
			return true
		}
		return makeMove(sourceSquare, targetSquare) // Try to make the move and return the result.
	}

	// Handles square click events
	function onSquareClick({ square }) {
		if (preview || game.isGameOver() || pendingPromotion || puzzleStatus !== 'playing') {
			return
		}
		// No square is selected yet -> select this one
		if (!selectedSquare) {
			const piece = game.get(square)

			// Select only pieces with the current turn's color
			if (piece && piece.color === game.turn()) {
				setSelectedSquare(square)
			}
			return
		}

		// Clicked the same square -> remove selection
		if (selectedSquare === square) {
			setSelectedSquare(null)
			return
		}

		// Check if move is a promotion move and if it is legal
		if (isPromotionMove(selectedSquare, square) && isLegalMove(selectedSquare, square)) {
			setPendingPromotion({ from: selectedSquare, to: square, color: game.turn() })
			return
		}

		const moveSuccessful = makeMove(selectedSquare, square)

		// If the move was not successful, check if another piece of the same color was selected
		if (!moveSuccessful) {
			const piece = game.get(square)

			if (piece && piece.color === game.turn()) {
				setSelectedSquare(square)
			} else {
				setSelectedSquare(null)
			}
		}
	}

	// Handles piece drag events
	function onPieceDrag({ square }) {
		const piece = game.get(square)
		if (piece && piece.color === game.turn()) {
			setIsDragging(true)
			setHoveredSquare(null)
			setSelectedSquare(square)
		}
	}

	// Handles mouse over square events
	function onMouseOverSquare({ square }) {
		if (!isDragging || !selectedSquare) {
			return
		}
		setHoveredSquare(isLegalMove(selectedSquare, square) ? square : null)
	}

	// Handles piece drag end events
	function onPieceDragEnd() {
		setIsDragging(false)
		setHoveredSquare(null)
	}

	// Attempts to make a move and returns whether it was successful.
	function makeMove(sourceSquare, targetSquare, promotionPiece) {
		const move = sourceSquare + targetSquare + (promotionPiece ?? '')
		const gameCopy = new Chess(game.fen()) // Make copy of the current game

		try {
			gameCopy.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: promotionPiece, // Your chosen promotion piece ('q', 'r', 'b', 'n')
			})
			// Check if move matches puzzle solution
			if (move !== puzzleMoves[puzzleMoveIndex]) {
				setMoveFeedback('wrong')
				return false
			}
			setMoveFeedback('right')
			setPendingPromotion(null)
			setGame(gameCopy)
			setSelectedSquare(null)
			setHintSquare(null)
			// Update puzzle move index and check if puzzle is solved
			const nextIndex = puzzleMoveIndex + 1
			setPuzzleMoveIndex(nextIndex)
			if (nextIndex >= puzzleMoves.length) {
				setPuzzleStatus('solved')
			}

			setPositions([
				...positions,
				{
					fen: gameCopy.fen(),
					lastMove: move,
				}
			])

			return true

		} catch  {
			return false
		}
	}

	// Handles computer move based on puzzle solution
	function computerMove(nextMove, errorText) {
		const gameCopy = new Chess(game.fen())
		try {
			gameCopy.move({
				from: nextMove.slice(0, 2),
				to: nextMove.slice(2, 4),
				promotion: nextMove.slice(4) || undefined,
			})
			setGame(gameCopy)
			setPuzzleMoveIndex(puzzleMoveIndex + 1)
			setPositions([
				...positions,
				{
					fen: gameCopy.fen(),
					lastMove: nextMove
				}
			])
		} catch (error){
			console.error(errorText, error)
		}
	}

	// Determines if a piece can be dragged from the given square
	function canDragPiece({ square }) {
		const piece = game.get(square)
		if (preview || game.isGameOver() || pendingPromotion || puzzleStatus !== 'playing') {
			return false
		}
		return piece && piece.color === game.turn()
	}

	return (
	//Render the chessboard with handlers.
		<div className="chessboard-container">
			<Chessboard
				options={{
					position: game.fen(), // FEN representing current game state
					boardOrientation: playerColor === 'w' ? 'white' : 'black', // Board orientation based on player's color
					onPieceDrag, // Handle piece drag events
					onPieceDragEnd, // Handle piece drag end events
					onMouseOverSquare, // Handle mouse over square events
					onPieceDrop,  // Handle piece drop events
					onSquareClick, // Handle square click events
					canDragPiece,  // Determine if piece can be dragged
					dropSquareStyle: {boxShadow: 'none'}, // Remove default style
					squareStyles: getSquareStyles(game, selectedSquare, lastMove, hintSquare, hoveredSquare), // Apply styles to squares
				}}
			/>
			<p>
				{puzzleStatus === "solved" ? "Puzzle ratkaistu"
					: moveFeedback === "right" ? "Hyvä siirto"
						: moveFeedback === "wrong" ? "Väärä siirto"
							: null}
			</p>
			<PromotionChooser
				pendingPromotion={pendingPromotion}
				onSelect={completePromotion}
			/>
		</div>

	)
})
export default PuzzleBoard

