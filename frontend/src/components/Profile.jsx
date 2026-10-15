import { useState, useEffect } from "react"
import { Card } from "react-bootstrap"
import "./Profile.css"
import { updateUserChessAccounts, getUserProfile } from "../services/userService"


const Profile = ({ setMessage, handleLogout }) => {
	const [lichess, setLichess] = useState("")
	const [chessCom, setChessCom] = useState("")
	const [profile, setProfile] = useState(null) // Contains username, email, verification status and chess account usernames
	const [editingLichess, setEditingLichess] = useState(false)
	const [editingChessCom, setEditingChessCom] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getUserProfile()
				console.log(data)
				setProfile(data)
				setLichess(data?.lichess ?? "")
				setChessCom(data?.chessCom ?? "")
			} catch (error) {
				// console.error("Failed to fetch user profile:", error)
				setMessage({ message: "Failed to fetch user profile: " + error.message, isError: true })
				setTimeout(() => {
					setMessage(null)
				}, 4000)
			}
		}
		fetchData()
	}, [setMessage])

	console.log("Profile data:", profile)

	const handleSendVerification = () => {
		// This should send a new verification email to the user
		console.log("TODO")
	}

	const handleUsernameChanges = async (accounts) => {
		if (!accounts.lichess && !accounts.chessCom) {
			setMessage({ message: "At least one of Lichess or Chess.com username must be provided", isError: true })
			setTimeout(() => {
				setMessage(null)
			}, 4000)
			return false
		}

		try {
			await updateUserChessAccounts(accounts)
			localStorage.removeItem("userGames")

			const data = await getUserProfile()
			console.log(data)
			setProfile(data)

			console.log("Chess accounts updated successfully:", data)
			setMessage({ message: "Chess account updated successfully", isError: false })
			setTimeout(() => {
				setMessage(null)
			}, 2000)
			return true
		} catch (error) {
			console.error("Failed to update chess accounts:", error)
			setMessage({ message: error.message, isError: true })
			setTimeout(() => {
				setMessage(null)
			}, 4000)
			return false
		}
	}

	const handleLichessEdit = async (showEdit) => {
		if (showEdit) {
			setLichess(profile?.lichess ?? "")
			setEditingLichess(true)
			return
		}

		const saved = await handleUsernameChanges({
			lichess: lichess.trim(),
			chessCom: profile?.chessCom ?? "",
		})

		if (saved) setEditingLichess(false)
	}

	const handleChessComEdit = async (showEdit) => {
		if (showEdit) {
			setChessCom(profile?.chessCom ?? "")
			setEditingChessCom(true)
			return
		}

		const saved = await handleUsernameChanges({
			lichess: profile?.lichess ?? "",
			chessCom: chessCom.trim(),
		})

		if (saved) setEditingChessCom(false)
	}

	return (

		<div id="profile-page">
			<button id="logout-btn" onClick={handleLogout}>log out</button>

			<Card id="account-card">
				<Card.Header>Account</Card.Header>
				<Card.Body>
					<div className="card-row">
						<p>Username</p>
						<p>{profile?.username}</p>
					</div>

					<div className="card-row">
						<p>Email</p>
						<p>{profile?.email ?? "-"}</p>
					</div>

					<div className="card-row">
						{!profile?.emailVerified && (
							<button id="send-verification-btn" type="button" className="btn btn-link" onClick={handleSendVerification}>
								Send verification email TODO!
							</button>
						)}

						{profile?.emailVerified ? <p className="text-success">Email verified</p> : <p className="text-warning">Email not verified</p>}
					</div>


				</Card.Body>
			</Card>
			<Card id="chess-accounts-card">
				<Card.Header>Chess Accounts</Card.Header>

				<Card.Body>
					<div className="card-row">
						<p>Connect your accounts so we can turn your games into puzzles</p>
					</div>

					<div className="card-row">
						<label htmlFor="lichess">Lichess</label>
						{editingLichess ? (
							<form className="inputGroup" onSubmit={(event) => { event.preventDefault(); handleLichessEdit(false) }}>
								<input id="lichess" type="text" onChange={(event) => setLichess(event.target.value)} value={lichess}/>
								<button className="cool-btn btn btn-link" type="submit">confirm</button>
								<button className="cool-btn btn btn-link" type="button" onClick={() => setEditingLichess(false)}>cancel</button>
							</form>
						) : (
							<div>
								{profile?.lichess || "Not connected"}
								<button className="cool-btn btn btn-link" onClick={() => handleLichessEdit(true)}>edit</button>
							</div>
						)}
					</div>

					<div className="card-row">
						<label htmlFor="chessCom">Chess.com</label>
						{editingChessCom ? (
							<form className="inputGroup" onSubmit={(event) => { event.preventDefault(); handleChessComEdit(false) }}>
								<input id="chessCom" type="text" onChange={(event) => setChessCom(event.target.value)} value={chessCom} />
								<button className="cool-btn btn btn-link" type="submit">confirm</button>
								<button className="cool-btn btn btn-link" type="button" onClick={() => setEditingChessCom(false)}>cancel</button>
							</form>
						) : (
							<div>
								{profile?.chessCom || "Not connected"}
								<button className="cool-btn btn btn-link" onClick={() => handleChessComEdit(true)}>edit</button>
							</div>
						)}
					</div>

				</Card.Body>
			</Card>
		</div>
	)
}

export default Profile