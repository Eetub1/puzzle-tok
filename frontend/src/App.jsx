import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import GetUserGames from './components/GetUserGames'
import { ChessBoard } from './components/ChessBoard.jsx'
import Puzzles from './components/Puzzles.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Message from "./components/Message.jsx"

function App() {
    const [user, setUser] = useState("") // Put any string other than empty here to simulate being logged in
    const [message, setMessage] = useState("")

    return (
        <>
            {message && <Message message={message}/>}
            <Routes>
                <Route path="/" element={user ?
                    <div>
                        <GetUserGames/>
                        <Puzzles/>
                        <ChessBoard/>
                    </div>
                    : <Navigate to="/login"/>}>
                </Route>

                <Route path="/login" element={!user ? <Login setUser={setUser}/> : <Navigate to="/"/>}/>
                <Route path="/signup" element={!user ? <Signup setMessage={setMessage}/> : <Navigate to="/"/>}/>

            </Routes>
        </>
    )
}

export default App
