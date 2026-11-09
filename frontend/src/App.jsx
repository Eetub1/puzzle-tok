import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import ChessReels from "./components/ChessReels"
import Login from "./components/Login.jsx"
import Signup from "./components/Signup.jsx"
import Message from "./components/Message.jsx"
import { logout } from "./services/authService.js"
import VerifyEmail from "./components/VerifyEmail.jsx"

const App = () => {
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("puzzleTokUser")))
	const [message, setMessage] = useState(null)

	console.log("User", user)

	const handleLogout = () => {
		logout()
		setUser(null)
	}

	// when application loads, check if the token has expired
	// If it has, logout immediately
	useEffect(() => {
		const wrapper = () => {
			if (!user) return

			const time = Date.now()
			if (time >= user.tokenExpiresAt) {
				handleLogout()
			}
		}
		wrapper()
	}, [user])

	const showMessage = (text, isError = false) => {
		setMessage({ message: text, isError })
		setTimeout(() => {
			setMessage(null)
		}, 4000)
	}


	return (
		<>
			<Routes>
				<Route path="/" element={user
					?
					<div>
						{message && <Message data={message}/>}
						<ChessReels handleLogout={handleLogout} showMessage={showMessage} setMessage={setMessage} user_id={user.id}/>
					</div>
					: <Navigate to="/login"/>}
				/>

				<Route path="/verify-email" element={<VerifyEmail/>}/>
				<Route path="/login" element={!user ? <Login setMessage={setMessage} setUser={setUser}/> : <Navigate to="/"/>}/>
				<Route path="/signup" element={!user ? <Signup setMessage={setMessage}/> : <Navigate to="/"/>}/>
			</Routes>
		</>
	)
}

export default App
