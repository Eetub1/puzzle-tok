import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"
import GetUserGames from "../components/GetUserGames.jsx"
import "./ProfilePages.css"

const ProfilePage = ({ user }) => {
	const navigate = useNavigate()

	const verifyEmail = () => {
		console.log("TODO")
	}

	console.log(user)
	return (
		<div>
			<Button onClick={() => navigate("/")}>Go to homepage</Button>
			<h2>Welcome to your profile page!</h2>
			<p>Username: {user.username}</p>
			{(user.email !== undefined && user.email !== null && user.email !== "") ? <p>Email: {user.email}</p> : <Button onClick={verifyEmail}>Verify email</Button>}

			<div className="get-user-games">
				<GetUserGames />
			</div>
		</div>
	)
}

export default ProfilePage