import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../services/authService"
import "./Auth.css"

const Login = ({ setMessage, setUser }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            const data = await login({ username, password })
            console.log(data)
            setUser(data)
            setUsername("")
            setPassword("")
            setMessage({ message: "Login successful!", isError: false })
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        } catch (error) {
            console.log("Error with login: ", error)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome Back</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            id="username" 
                            type="text" 
                            onChange={(event) => setUsername(event.target.value)} 
                            value={username}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password" 
                            type="password" 
                            onChange={(event) => setPassword(event.target.value)} 
                            value={password}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button className="auth-submit-btn" type="submit">Login</button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login