import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

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
			{user.email !== "" ? <p>Email: {user.email}</p> : <Button onClick={verifyEmail}>Verify email</Button>}
		</div>
	)
}

export default ProfilePage