import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { signup } from "../services/authService"

const Signup = ({ setMessage }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            const user = await signup({ username, password })
            setUsername("")
            setPassword("")
            navigate("/login")
            console.log(user)
            setMessage("Signup was succesful!")
            setTimeout(() => {
                setMessage("")
            }, 4000)
        } catch (error) {
            console.log("Error with signup: ", error)
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
                <button type="submit">Sign up</button>

                <div>
                    <span>Already have an account? </span>
                    <Link to="/login" style={{textDecoration: "none"}}>Login</Link>
                </div>
            </form>
        </div>
    )
}

export default Signup