import "./ChessReels.css"
import Dropdown from "react-bootstrap/Dropdown"

export default function ChessReels({ children, puzzleRef }) {
	return (
		<div className="chess-reels">
			{/* Yläpalkki */}
			<div className="top-bar">
				<Dropdown.Menu show>
					<Dropdown.Item>Your Matches</Dropdown.Item>
					<Dropdown.Item>Puzzles</Dropdown.Item>
					<Dropdown.Item>Openings</Dropdown.Item>
				</Dropdown.Menu>
				<button className="profile-btn" aria-label="Profile">👤</button>
			</div>
      
			{/* Scrolli */}
			<div className="content-row">
				{children}
				<div className="scroll-controls">
					<button aria-label="Previous puzzle">▲</button>
					<button aria-label="Next puzzle">▼</button>
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