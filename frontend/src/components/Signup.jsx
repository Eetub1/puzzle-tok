import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signup } from "../services/authService"
import "./Auth.css"

const Signup = ({ setMessage }) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            // Not doing anything useful with the user right now
            const user = await signup({ username, email, password })
            console.log(user)

            setUsername("")
            setPassword("")
            navigate("/login")
            setMessage({ message: "Account created! Check your email to verify your address", isError: false })
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        } catch (error) {
            setMessage({ message: "Error with signup: " + error, isError: true})
            setTimeout(() => {
                setMessage(null)
            }, 4000)
            console.log("Error with signup: ", error)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            id="username" 
                            type="text" 
                            onChange={(event) => setUsername(event.target.value)} 
                            value={username}
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            onChange={(event) => setEmail(event.target.value)} 
                            value={email}
                            placeholder="Enter your email"
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
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button className="auth-submit-btn" type="submit">Sign up</button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <Link to="/login" className="auth-link">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup