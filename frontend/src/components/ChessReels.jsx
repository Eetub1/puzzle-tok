import { useRef } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import PuzzleBoard from "./chessboard/PuzzleBoard.jsx"
import ChessBoard from "./chessboard/ChessBoard.jsx"
import "./ChessReels.css"
import { usePuzzleReels } from "../hooks/usePuzzleReels.js"
import { useNavigate } from "react-router-dom"

export default function ChessReels({
	handleLogout,
	handleNextPuzzle,
	handlePreviousPuzzle,
	menuOpen,
	setMenuOpen,
	previousPuzzle,
	nextPuzzle,
	currentPuzzle,
}) {

	const puzzleBoardRef = useRef(null)
	const navigate = useNavigate()

	const {
		isPuzzlesMenu,
		slideIndex,
		transition,
		goNext,
		goPrev,
		handleTrackTransitionEnd,
		handleWheel,
	} = usePuzzleReels({ menuOpen, handleNextPuzzle, handlePreviousPuzzle })

	return (
		<div className="chess-reels">
			<div className="top-bar">
				<button onClick={handleLogout} className="logout-btn">Logout</button>
				<Dropdown.Menu show>
					<Dropdown.Item active={menuOpen === "YourMatches"} onClick={() => setMenuOpen("YourMatches")}>Your Matches</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Puzzles"} onClick={() => setMenuOpen("Puzzles")}>Puzzles</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Openings"} onClick={() => setMenuOpen("Openings")}>Openings</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "DailyPuzzle"} onClick={() => setMenuOpen("DailyPuzzle")}>Daily Puzzle</Dropdown.Item>
				</Dropdown.Menu>
				<button onClick={() => navigate("/profile")} className="profile-btn" aria-label="Profile">👤</button>
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
