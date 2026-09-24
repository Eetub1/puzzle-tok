import { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = event => {
        
    }

    return (
        <div className="testDiv" >
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
