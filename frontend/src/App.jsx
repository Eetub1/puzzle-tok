import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import GetUserGames from './components/GetUserGames'
import { ChessBoard } from './components/ChessBoard.jsx'
import Puzzles from './components/Puzzles.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Message from "./components/Message.jsx"
import { logout } from "./services/authService.js"

function App() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("puzzleTokUser")))
    const [message, setMessage] = useState(null)

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
                        <GetUserGames/>
                        <Puzzles/>
                        <ChessBoard/>
                    </div>
                    : <Navigate to="/login"/>}>
                </Route>

                <Route path="/login" element={!user ? <Login setMessage={setMessage} setUser={setUser}/> : <Navigate to="/"/>}/>
                <Route path="/signup" element={!user ? <Signup setMessage={setMessage}/> : <Navigate to="/"/>}/>

            </Routes>
        </>
    )
}

export default App
