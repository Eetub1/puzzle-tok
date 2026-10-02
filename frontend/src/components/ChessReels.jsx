import "./ChessReels.css"
import Dropdown from "react-bootstrap/Dropdown"
import { useNavigate } from "react-router-dom"

export default function ChessReels({ children, puzzleRef, handleNextPuzzle, handlePreviousPuzzle, menuOpen, setMenuOpen}) {
	const navigate = useNavigate()

	return (
		<div className="chess-reels">
			{/* Yläpalkki */}
			<div className="top-bar">
				<Dropdown.Menu show>
					<Dropdown.Item active={menuOpen === "YourMatches"} onClick={() => setMenuOpen("YourMatches")}>Your Matches</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Puzzles"} onClick={() => setMenuOpen("Puzzles")}>Puzzles</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Openings"} onClick={() => setMenuOpen("Openings")}>Openings</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "DailyPuzzle"} onClick={() => setMenuOpen("DailyPuzzle")}>Daily Puzzle</Dropdown.Item>
				</Dropdown.Menu>
				<button onClick={() => navigate("/profile")} className="profile-btn" aria-label="Profile">👤</button>
			</div>

			{/* Scrolli */}
			<div className="content-row">
				{children}
				<div className="scroll-controls">
					<button onClick={() => handlePreviousPuzzle()} aria-label="Previous puzzle">▲</button>
					<button onClick={() => handleNextPuzzle()} aria-label="Next puzzle">▼</button>
				</div>
			</div>

			{ /* Alajutskat */}
			<div className="bottom-bar">
				<div className="action-buttons">
					<button onClick={() => puzzleRef?.current?.giveHint()} className="hint-btn">Hint</button>
					<button onClick={() => puzzleRef?.current?.giveSolution()} className="solution-btn">Solution</button>
				</div>

				<div className="step-controls">
					<button onClick={() => puzzleRef?.current?.moveBack()} aria-label="Previous move">◀</button>
					<button onClick={() => puzzleRef?.current?.moveForward()} aria-label="Next move">▶</button>
				</div>
			</div>
		</div>
	)
}