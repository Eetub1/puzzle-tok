import { useState, useRef, useEffect } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import PuzzleBoard from "./chessboard/PuzzleBoard.jsx"
import ChessBoard from "./chessboard/ChessBoard.jsx"
import "./ChessReels.css"

export default function ChessReels({
	handleNextPuzzle,
	handlePreviousPuzzle,
	menuOpen,
	setMenuOpen,
	previousPuzzle,
	nextPuzzle,
	currentPuzzle,
}) {

	const [slideIndex, setSlideIndex] = useState(1)
	const [animating, setAnimating] = useState(false)
	const [transition, setTransition] = useState(true)
	const [direction, setDirection] = useState(null)

	const puzzleBoardRef = useRef(null) 
	const lockRef = useRef(false); 
	const silenceTimeoutRef = useRef(null) 
	const isPuzzlesMenu = Boolean(menuOpen === "Puzzles")
	
	// Reset slide index and animation state
	useEffect(() => {
		setSlideIndex(1)
		setAnimating(false)
		setDirection(null)
	}, [isPuzzlesMenu])

	// Handle moving to next puzzle in queue
	function goNext() {
		if (!isPuzzlesMenu || animating || !nextPuzzle) {
			return
		}
		lockRef.current = true
		setDirection("next")
		setSlideIndex(2)
		setTransition(true)
		setAnimating(true)
	}

	// Handle moving to previous puzzle in memory
	function goPrev() {
		if (!isPuzzlesMenu || animating || !previousPuzzle) {
			return
		}
		lockRef.current = true
		setDirection("prev")
		setSlideIndex(0)
		setTransition(true)
		setAnimating(true)
	}

	// Handle transition end
	function handleTrackTransitionEnd() {
		if (!direction) { 
			return
		}
		if (direction === "next") {
			handleNextPuzzle()
		} else {
			handlePreviousPuzzle()
		}
		setDirection(null)
		setTransition(false)
		setSlideIndex(1)
		setAnimating(false)
		requestAnimationFrame(() => { 
			setTransition(true)
		})
		releaseAfterSilence()
	}

	// Handle wheel events for scrolling puzzles
	function handleWheel(event) {
		event.preventDefault()
		if (lockRef.current || animating) {
			releaseAfterSilence()
			return
		}
		if(event.deltaY > 20) {
			goNext()
			return
		} 
		if(event.deltaY < -20) {
			goPrev()
			return
		}
	}

	// Release lock after short timeout to allow new wheel events
	function releaseAfterSilence() {
		clearTimeout(silenceTimeoutRef.current)
		silenceTimeoutRef.current = setTimeout(() => {
			lockRef.current = false
		}, 100)
	}

	return (
		<div className="chess-reels">
			<div className="top-bar">
				<Dropdown.Menu show>
					<Dropdown.Item active={menuOpen === "YourMatches"} onClick={() => setMenuOpen("YourMatches")}>Your Matches</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Puzzles"} onClick={() => setMenuOpen("Puzzles")}>Puzzles</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Openings"} onClick={() => setMenuOpen("Openings")}>Openings</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "DailyPuzzle"} onClick={() => setMenuOpen("DailyPuzzle")}>Daily Puzzle</Dropdown.Item>
				</Dropdown.Menu>
				<button className="profile-btn" aria-label="Profile">👤</button>
			</div>

			<div className="content-row">
				{isPuzzlesMenu ? (
					<div className="reels-container" onWheel={handleWheel}>
						<div
							className={`reels-slides${transition ? " reels-slides-animated" : ""}`}
							style={{ transform: `translateY(-${slideIndex * 100}%)` }}
							onTransitionEnd={handleTrackTransitionEnd}
						>
							<div className="reels-slide">
								{previousPuzzle ? (<PuzzleBoard key={previousPuzzle.fen} puzzle={previousPuzzle} preview={true}/>) 
								: (<p>Loading puzzle...</p>)}
							</div>
							<div className="reels-slide">
								{currentPuzzle ? (<PuzzleBoard key={currentPuzzle.fen} ref={puzzleBoardRef} puzzle={currentPuzzle} preview={false}/>) 
								: (<p>Loading puzzle...</p>)}
							</div>
							<div className="reels-slide">
								{nextPuzzle ? (<PuzzleBoard key={nextPuzzle.fen} puzzle={nextPuzzle} preview={true}/>) 
								: (<p>Loading puzzle...</p>)}
							</div>
						</div>
					</div>
				) : (
					<div className = "other-content">
							{menuOpen === "DailyPuzzle" && (currentPuzzle ? <PuzzleBoard key={currentPuzzle.fen} ref={puzzleBoardRef} puzzle={currentPuzzle}/> : <p>Loading puzzle...</p>)}
							{menuOpen === "YourMatches" && <p>Here will be your matches</p>}
							{menuOpen === "Openings" && <ChessBoard/>}
					</div>
				)}

				<div className="scroll-controls">
					<button onClick={() => goPrev()} aria-label="Previous puzzle">▲</button>
					<button onClick={() => goNext()} aria-label="Next puzzle">▼</button>
				</div>
			</div>

			<div className="bottom-bar">
				<div className="action-buttons">
					<button onClick={() => puzzleBoardRef?.current?.giveHint()} className="hint-btn">Hint</button>
					<button onClick={() => puzzleBoardRef?.current?.giveSolution()} className="solution-btn">Solution</button>
				</div>

				<div className="step-controls">
					<button onClick={() => puzzleBoardRef?.current?.moveBack()} aria-label="Previous move">◀</button>
					<button onClick={() => puzzleBoardRef?.current?.moveForward()} aria-label="Next move">▶</button>
				</div>
			</div>
		</div>
	)
}
