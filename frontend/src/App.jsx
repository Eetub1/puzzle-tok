import { useState} from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import ChessReels from "./components/ChessReels"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Message from "./components/Message.jsx"
import { logout } from "./services/authService.js"
import { usePuzzleQueue } from "./hooks/usePuzzleQueue.js"
import VerifyEmail from "./components/VerifyEmail.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"


function App() {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("puzzleTokUser")))
	const [message, setMessage] = useState(null)
	const [menuOpen, setMenuOpen] = useState("DailyPuzzle")
	const {currentPuzzle, previousPuzzle, nextPuzzle, handleNextPuzzle, handlePreviousPuzzle} = usePuzzleQueue({menuOpen})

	const handleLogout = () => {
		logout()
		setUser(null)
	}

	return (
		<>
			<Routes>
				<Route path="/" element={user ?
					<div>
						{message && <Message data={message}/>}
						<ChessReels
							key={menuOpen}
							handleLogout={handleLogout}
							handleNextPuzzle={handleNextPuzzle}
							handlePreviousPuzzle={handlePreviousPuzzle}
							menuOpen={menuOpen}
							setMenuOpen={setMenuOpen}
							currentPuzzle={currentPuzzle}
							previousPuzzle={previousPuzzle}
							nextPuzzle={nextPuzzle}
						>
						</ChessReels>
					</div>
					
					: <Navigate to="/login"/>}
				/>

				<Route path="/profile" element={user ? <ProfilePage user={user}/> : <Login setMessage={setMessage} setUser={setUser}/>}/>
				<Route path="/verify-email" element={<VerifyEmail/>}/>
				<Route path="/login" element={!user ? <Login setMessage={setMessage} setUser={setUser}/> : <Navigate to="/"/>}/>
				<Route path="/signup" element={!user ? <Signup setMessage={setMessage}/> : <Navigate to="/"/>}/>
			</Routes>
		</>
	)
}

export default App