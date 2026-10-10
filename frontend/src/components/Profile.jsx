import { useState, useEffect } from "react"
import Button from "react-bootstrap/Button"
import "./Profile.css"
import { updateUserChessAccounts, getUserProfile } from "../services/userService"


const ProfilePage = ({ setMessage }) => {
	const [lichess, setLichess] = useState("")
	const [chessCom, setChessCom] = useState("")
	const [profile, setProfile] = useState(null) // Contains username, lichess and chess.com usernames and email if it has been verified
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Need a helper to use async functions inside useEffect
		const fetchData = async () => {
			try {
				const data = await getUserProfile()
				console.log(data)
				setProfile(data)
			} catch (error) {
				console.error("Failed to fetch user profile:", error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	const verifyEmail = () => {
		// This should send a new verification email to the user
		console.log("TODO")
	}

	const handleSubmit = async event => {
		event.preventDefault()
		localStorage.removeItem("userGames") // Clear the cached games when the user updates their chess accounts

		try {
			await updateUserChessAccounts({ lichess, chessCom })
			const data = await getUserProfile()
			console.log(data)
			setProfile(data)
			if (!data.lichess && !data.chessCom) {
				setMessage({ message: "At least one of Lichess or Chess.com username must be provided", isError: true })
				setTimeout(() => {
					setMessage(null)
				}, 4000)
				return
			}

			console.log("Chess accounts updated successfully:", data)
			setLichess("")
			setChessCom("")
			setMessage({ message: "Chess accounts updated successfully!", isError: false })
			setTimeout(() => {
				setMessage(null)
			}, 4000)
		} catch (error) {
			console.error("Failed to update chess accounts:", error)
		}
	}

	const handleAccountChanges = () => {
		// need to reopen form with current values prefilled
		setLichess(profile.lichess || "")
		setChessCom(profile.chessCom || "")
		setProfile({ ...profile, lichess: "", chessCom: "" })
	}

	return (
		<div>
			<h2>Profile page</h2>

			{(profile?.email) ?
				<p>Email: {profile.email}</p>
				: <><div>Email Not verified</div><Button onClick={verifyEmail}>Verify email</Button></>}

			{!profile?.lichess && !profile?.chessCom && !isLoading &&
			<>
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
			</>
			}

			{(profile?.lichess || profile?.chessCom) &&
			<>
				<p>Your connected chess accounts:</p>
				<ul>
					{profile.lichess ? <li>Lichess: {profile.lichess}</li> : <li>Lichess: Not connected</li>}
					{profile.chessCom ? <li>Chess.com: {profile.chessCom}</li> : <li>Chess.com: Not connected</li>}
				</ul>
				<Button onClick={handleAccountChanges}>Change accounts?</Button>
			</>
			}

		</div>
	)
}

export default ProfilePage