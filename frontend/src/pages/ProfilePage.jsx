import { useState } from "react"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"
import "./ProfilePages.css"
import { updateUserChessAccounts } from "../services/userService"

const ProfilePage = ({ user, setMessage }) => {
	const [lichess, setLichess] = useState("")
	const [chessCom, setChessCom] = useState("")

	const navigate = useNavigate()

	const verifyEmail = () => {
		console.log("TODO")
	}

	const handleSubmit = async event => {
		event.preventDefault()

		try {
			await updateUserChessAccounts({ lichess, chessCom })
			setMessage({ message: "Chess accounts updated successfully!", isError: false })
			setTimeout(() => {
				setMessage(null)
			}, 4000)
		} catch (error) {
			console.error("Failed to update chess accounts:", error)
		}
	}

	console.log(user)
	return (
		<div>
			<Button onClick={() => navigate("/")}>Go to homepage</Button>
			<h2>Welcome to your profile page!</h2>
			<p>Username: {user.username}</p>
			{(user.email !== undefined && user.email !== null && user.email !== "") ? <p>Email: {user.email}</p> : <Button onClick={verifyEmail}>Verify email</Button>}

			<div>
				<form onSubmit={handleSubmit}>
					<fieldset>Connect your accounts</fieldset>

					<div>
						<label htmlFor="lichess">Lichess: </label>
						<input id="lichess" type="text" onChange={(event) => setLichess(event.target.value)} value={lichess}/>
					</div>

					<div>
						<label htmlFor="chessCom">Chess.com: </label>
						<input id="chessCom" type="text" onChange={(event) => setChessCom(event.target.value)} value={chessCom} />
					</div>

					<Button type="submit">Connect accounts</Button>
				</form>
			</div>
		</div>
	)
}

export default ProfilePage