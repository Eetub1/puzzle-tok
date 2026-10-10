import { useState} from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import ChessReels from "./components/ChessReels"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Message from "./components/Message.jsx"
import VerifyEmail from "./components/VerifyEmail.jsx"

import { logout } from "./services/authService.js"
import ProfilePage from "./pages/ProfilePage.jsx"

const App = () => {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("puzzleTokUser")))
	const [message, setMessage] = useState(null)

	const handleLogout = () => {
		logout()
		setUser(null)
	}

	return (
		<>
			<Routes>
				<Route path="/" element={user
					?
					<>
						{message && <Message data={message}/>}
						<ChessReels handleLogout={handleLogout}></ChessReels>
					</>
					: <Navigate to="/login"/>}
				/>

				<Route path="/profile" element={user ? <ProfilePage setMessage={setMessage}/> : <Login setMessage={setMessage} setUser={setUser}/>}/>
				<Route path="/verify-email" element={<VerifyEmail/>}/>
				<Route path="/login" element={!user ? <Login setMessage={setMessage} setUser={setUser}/> : <Navigate to="/"/>}/>
				<Route path="/signup" element={!user ? <Signup setMessage={setMessage}/> : <Navigate to="/"/>}/>
			</Routes>
		</>
	)
}

export default App