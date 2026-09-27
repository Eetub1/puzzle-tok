import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../services/authService"

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
            setMessage({ message: "Login succesful!", isError: false })
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        } catch (error) {
            console.log("Error with login: ", error)
        }
    }

    return (
        <div className="testSection" >
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input id="username" type="text" onChange={(event) => setUsername(event.target.value)} value={username}/>
                    </div>

                    <div>
                        <label htmlFor="password">Password: </label>
                        <input id="password" type="password" onChange={(event) => setPassword(event.target.value)} value={password} />
                    </div>
                </div>
                <button type="submit">Login</button>

                <div>
                    <span>Don't have an account? </span>
                    <Link to="/signup" style={{textDecoration: "none"}}>Sign Up</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
