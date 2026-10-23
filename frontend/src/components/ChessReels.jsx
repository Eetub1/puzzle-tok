import { useEffect, useRef, useState } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import PuzzleBoard from "./chessboard/PuzzleBoard.jsx"
import ChessBoard from "./chessboard/ChessBoard.jsx"
import Profile from "./Profile.jsx"
import Preferences from "./Preferences.jsx"
import "./ChessReels.css"
import { useNavigate } from "react-router-dom"
import { usePuzzleReels } from "../hooks/usePuzzleReels.js"
import { usePuzzleQueue } from "../hooks/usePuzzleQueue.js"
import { getStreak } from "../services/userService.js"
import { usePreference } from "../hooks/usePreference.js"

import Matches from "./Matches.jsx"

const ChessReels = ({ handleLogout, setMessage, user_id }) => {
	const [menuOpen, setMenuOpen] = useState("DailyPuzzle")
	const {difficulty, color, setDifficulty, setColor} = usePreference()
	const puzzleQueue = usePuzzleQueue({menuOpen, difficulty, color})
	const {currentPuzzle, previousPuzzle, nextPuzzle, saveDailyPuzzleState} = puzzleQueue
	const [showBottomBar, setShowBottomBar] = useState(true)
	const [showScrollControls, setShowScrollControls] = useState(false)
	const [showMoveControls, setShowMoveControls] = useState(true)

	const boardRef = useRef(null)


	// Functions to handle navigate between puzzle and saving puzzle state 
	function handleNextPuzzle() {
    	puzzleQueue.handleNextPuzzle(boardRef.current?.getPuzzleState())
	}

	function handlePreviousPuzzle() {
		puzzleQueue.handlePreviousPuzzle(boardRef.current?.getPuzzleState())
	}
	
	const [streak, setStreak] = useState(0)

	useEffect(() => {
		getStreak().then(setStreak).catch(console.error)
	}, [])

	async function handleEnded() {
		try {
			setStreak(await getStreak())
		} catch (error) {
			console.error(error)
		}
	}

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

	const handleMenuClick = (clickedOption) => {
		if (menuOpen === "DailyPuzzle" && clickedOption !== menuOpen) { // Save puzzle state when leaving Daily Puzzle menu
        	saveDailyPuzzleState(boardRef.current?.getPuzzleState())
    	}
		setMenuOpen(clickedOption)

		switch (clickedOption) {
			case "YourMatches":
				setShowBottomBar(false)
				setShowScrollControls(false)
				setShowMoveControls(false)
				break
			case "Puzzles":
				setShowBottomBar(true)
				setShowScrollControls(true)
				setShowMoveControls(true)
				break
			case "Openings":
				setShowBottomBar(false)
				setShowScrollControls(false)
				setShowMoveControls(true)
				break
			case "DailyPuzzle":
				setShowBottomBar(true)
				setShowScrollControls(false)
				setShowMoveControls(true)
				break
			case "Profile":
				setShowBottomBar(false)
				setShowScrollControls(false)
				setShowMoveControls(false)
				break
			default:
				setShowBottomBar(false)
				setShowScrollControls(false)
				setShowMoveControls(false)
		}
	}

	return (
		<div className="chess-reels">
			<div className="top-bar">
				<Dropdown.Menu show>
					<Dropdown.Item active={menuOpen === "YourMatches"} onClick={() => handleMenuClick("YourMatches")}>Your Matches</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Puzzles"} onClick={() => handleMenuClick("Puzzles")}>Puzzles</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "Openings"} onClick={() => handleMenuClick("Openings")}>Openings</Dropdown.Item>
					<Dropdown.Item active={menuOpen === "DailyPuzzle"} onClick={() => handleMenuClick("DailyPuzzle")}>Daily Puzzle</Dropdown.Item>
				</Dropdown.Menu>
				<button onClick={() => navigate("/profile")} className="profile-btn" aria-label="Profile">👤</button>
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
								{currentPuzzle ? (<PuzzleBoard key={currentPuzzle.fen} ref={boardRef} puzzle={currentPuzzle} preview={false} onEnded={handleEnded} streak={streak}/>)
									: (<p>Loading puzzle...</p>)}
							</div>
							<div className="reels-slide">
								{nextPuzzle ? (<PuzzleBoard key={nextPuzzle.fen} puzzle={nextPuzzle} preview={true}/>)
									: (<p>Loading puzzle...</p>)}
							</div>
						</div>
					</div>
				) : (
					<div className={`other-content${menuOpen === "DailyPuzzle" || menuOpen === "Openings" ? " no-reels-content" : ""}`}>
						{menuOpen === "DailyPuzzle" && (currentPuzzle ? <PuzzleBoard key={currentPuzzle.fen} ref={boardRef} puzzle={currentPuzzle} onEnded={handleEnded} streak={streak}/> : <p>Loading puzzle...</p>)}
						{menuOpen === "Openings" && <ChessBoard ref={boardRef}/>}
						{menuOpen === "YourMatches" && <Matches setMessage={setMessage}/>}
						{menuOpen === "Profile" && <Profile setMessage={setMessage} handleLogout={handleLogout}/>}
					</div>
				)}

				{showScrollControls && <div className="scroll-controls">
					<button onClick={() => goPrev()} aria-label="Previous puzzle">▲</button>
					<button onClick={() => goNext()} aria-label="Next puzzle">▼</button>
				</div>}
			</div>
			
			<div className="bottom-bar">
				{showBottomBar && 
				<div className="action-buttons">
					<button onClick={() => boardRef?.current?.giveHint()} className="hint-btn">Hint</button>
					<button onClick={() => boardRef?.current?.giveSolution()} className="solution-btn">Solution</button>
				</div>}

				{showMoveControls && 
				<div className="step-controls">
					<button onClick={() => boardRef?.current?.moveBack()} aria-label="Previous move">◀</button>
					<button onClick={() => boardRef?.current?.moveForward()} aria-label="Next move">▶</button>
				</div>}

				{menuOpen === "Puzzles" && <Preferences user_id={user_id} difficulty={difficulty} color={color} setDifficulty={setDifficulty} setColor={setColor}/>}
			</div>
		</div>
	)
}

export default ChessReels
