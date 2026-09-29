import { useState, useRef } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import ChessReels from "./components/ChessReels"
import GetUserGames from "./components/GetUserGames"
import PuzzleBoard from "./components/chessboard/PuzzleBoard.jsx"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Message from "./components/Message.jsx"
import { logout } from "./services/authService.js"
import { usePuzzleQueue } from "./hooks/usePuzzleQueue.js"


function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("puzzleTokUser")))
	const [message, setMessage] = useState(null)
	const puzzleBoardRef = useRef(null) // Ref for PuzzleBoard to call methods in ChessReels
	const {puzzle, handleNextPuzzle, handlePreviousPuzzle} = usePuzzleQueue() // Custom hook to puzzle queue, memory and current puzzle

	const handleLogout = () => {
		logout()
		setUser(null)
	}

	return (
		<>
			{user &&
            <div>
            	<button onClick={handleLogout}>Logout</button>
            </div>}

			{message && <Message data={message}/>}
			<Routes>
				<Route path="/" element={user ?
					<div>
						<GetUserGames />
						<ChessReels puzzleRef={puzzleBoardRef} handleNextPuzzle={handleNextPuzzle} handlePreviousPuzzle={handlePreviousPuzzle}>
							{puzzle ? <PuzzleBoard key={puzzle.fen} ref={puzzleBoardRef} puzzle={puzzle}/> : null}
						</ChessReels>
					</div>
					: <Navigate to="/login"/>}
				/>

				<Route path="/login" element={!user ? <Login setMessage={setMessage} setUser={setUser}/> : <Navigate to="/"/>}/>
				<Route path="/signup" element={!user ? <Signup setMessage={setMessage}/> : <Navigate to="/"/>}/>
			</Routes>
		</>
	)
}

export default App