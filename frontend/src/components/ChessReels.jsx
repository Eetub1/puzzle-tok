import { useRef, useState } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import PuzzleBoard from "./chessboard/PuzzleBoard.jsx"
import ChessBoard from "./chessboard/ChessBoard.jsx"
import Profile from "./Profile.jsx"
import "./ChessReels.css"
import { usePuzzleReels } from "../hooks/usePuzzleReels.js"
import { usePuzzleQueue } from "../hooks/usePuzzleQueue.js"

import Matches from "./Matches.jsx"

const ChessReels = ({ handleLogout, setMessage }) => {
	const [menuOpen, setMenuOpen] = useState("DailyPuzzle")
	const {currentPuzzle, previousPuzzle, nextPuzzle, handleNextPuzzle, handlePreviousPuzzle} = usePuzzleQueue({menuOpen})
	const [showBottomBar, setShowBottomBar] = useState(true)
	const [showScrollControls, setShowScrollControls] = useState(true)

	const puzzleBoardRef = useRef(null)

	const {
		isPuzzlesMenu,
		slideIndex,
		transition,
		goNext,
		goPrev,
		handleTrackTransitionEnd,
		handleWheel,
	} = usePuzzleReels({ menuOpen, handleNextPuzzle, handlePreviousPuzzle })

	const handleMenuClick = (clickedOption) => {
		setMenuOpen(clickedOption)

		switch (clickedOption) {
			case "YourMatches":
				setShowBottomBar(false)
				setShowScrollControls(false)
				break
			case "Puzzles":
				setShowBottomBar(true)
				setShowScrollControls(true)
				break
			case "Openings":
				setShowBottomBar(false)
				setShowScrollControls(false)
				break
			case "DailyPuzzle":
				setShowBottomBar(true)
				setShowScrollControls(true)
				break
			case "Profile":
				setShowBottomBar(false)
				setShowScrollControls(false)
				break
			default:
				setShowBottomBar(false)
				setShowScrollControls(false)
		}
	}

	return (
		<div className="chess-reels">
			<div className="top-bar">
				<button onClick={handleLogout} className="logout-btn">Logout</button>
				<Dropdown.Menu show>
					<Dropdown.Item active={menuOpen === "YourMatches"} onClick={() => handleMenuClick("YourMatches")}>Your Matches</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Puzzles"} onClick={() => handleMenuClick("Puzzles")}>Puzzles</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Openings"} onClick={() => handleMenuClick("Openings")}>Openings</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "DailyPuzzle"} onClick={() => handleMenuClick("DailyPuzzle")}>Daily Puzzle</Dropdown.Item>
				</Dropdown.Menu>
				<button onClick={() => handleMenuClick("Profile")} className="profile-btn" aria-label="Profile">👤</button>
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
						{menuOpen === "YourMatches" && <Matches/>}
						{menuOpen === "Openings" && <ChessBoard/>}
						{menuOpen === "Profile" && <Profile setMessage={setMessage}></Profile>}
					</div>
				)}

				{showScrollControls && <div className="scroll-controls">
					<button onClick={() => goPrev()} aria-label="Previous puzzle">▲</button>
					<button onClick={() => goNext()} aria-label="Next puzzle">▼</button>
				</div>}
			</div>

			{showBottomBar && <div className="bottom-bar">
				<div className="action-buttons">
					<button onClick={() => puzzleBoardRef?.current?.giveHint()} className="hint-btn">Hint</button>
					<button onClick={() => puzzleBoardRef?.current?.giveSolution()} className="solution-btn">Solution</button>
				</div>

				<div className="step-controls">
					<button onClick={() => puzzleBoardRef?.current?.moveBack()} aria-label="Previous move">◀</button>
					<button onClick={() => puzzleBoardRef?.current?.moveForward()} aria-label="Next move">▶</button>
				</div>
			</div>}
		</div>
	)
}

export default ChessReels