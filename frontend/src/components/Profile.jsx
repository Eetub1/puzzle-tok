import { useState, useEffect } from "react"
import { Card, Button } from "react-bootstrap"
import "./Profile.css"
import { updateUserChessAccounts, getUserProfile } from "../services/userService"
import { resendEmailVerification } from "../services/userService"
import { searchUsers, sendFriendRequest, cancelInvite, getReceivedInvites, getFriends } from "../services/friendService"

const Profile = ({ showMessage, handleLogout }) => {
	const [lichess, setLichess] = useState("")
	const [chessCom, setChessCom] = useState("")
	const [profile, setProfile] = useState(null) // Contains username, email, verification status and chess account usernames
	const [editingLichess, setEditingLichess] = useState(false)
	const [editingChessCom, setEditingChessCom] = useState(false)
	const [friendUsername, setFriendUsername] = useState("")
	const [relevantUsers, setRelevantUsers] = useState([]) // usernames found by search
	const [friendInvites, setFriendInvites] = useState([])
	const [friends, setFriends] = useState([])


	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getUserProfile()
				setProfile(data)
				setLichess(data?.lichess ?? "")
				setChessCom(data?.chessCom ?? "")

				const invites = await getReceivedInvites()
				setFriendInvites(invites)

				const friends = await getFriends()
				setFriends(friends)
			} catch (error) {
				showMessage(error.message, true)
			}
		}
		fetchData()
	}, [showMessage]) // this probably shouldn't be a dependency, but eslint is complaining about it


	const handleSendVerification = async () => {
		try {
			await resendEmailVerification()
			showMessage("Email verification link resent")
		} catch (error) {
			showMessage(error.message, true)
		}
	}


	const handleUsernameChanges = async (accounts) => {
		if (!accounts.lichess && !accounts.chessCom) {
			showMessage("At least one of Lichess or Chess.com username must be provided", true)
			return false
		}

		try {
			await updateUserChessAccounts(accounts)
			localStorage.removeItem("userGames")

			const data = await getUserProfile()
			setProfile(data)

			showMessage("Chess account updated successfully")

			return true
		} catch (error) {
			console.error("Failed to update chess accounts:", error)
			showMessage(error.message, true)
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


	const handleFriendSearch = async event => {
		const friendQuery = event.target.value
		setFriendUsername(friendQuery)

		try {
			setRelevantUsers(await searchUsers(friendQuery))
		} catch (error) {
			showMessage(error.message, true)
		}
	}


	const handleSendFriendInvite = async friendId => {
		try {
			const result = await sendFriendRequest(friendId)
			showMessage(result.message)

			// use the already typed query to get the same users again
			// this is so that the add friend button disappears for this specific user
			setRelevantUsers(await searchUsers(friendUsername))
		} catch (error) {
			showMessage(error.message, true)
		}
	}


	const handleCancelInvite = async friendId => {
		try {
			const result = await cancelInvite(friendId)
			showMessage(result.message)

			setRelevantUsers(await searchUsers(friendUsername))
		} catch (error) {
			showMessage(error.message, true)
		}
	}


	const handleAcceptInvite = async requesterId => {

	}


	const handleDeclineInvite = async requesterId => {
		
	}


	return (
		<div id="profile-page">
			<button id="logout-btn" onClick={handleLogout}>log out</button>

			<Card id="account-card">
				<Card.Header>
					<h4>Account</h4>
				</Card.Header>
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
								Send verification email
							</button>
						)}

						{profile?.emailVerified ? <p className="text-success">Email verified</p> : <p className="text-warning">Email not verified</p>}
					</div>


				</Card.Body>
			</Card>

			<Card id="friends-card">
				<Card.Header>
					<h4>Friends</h4>
				</Card.Header>
				<Card.Body>
					<div id="friends-section">
						<div id="received-invites-container">
							<h5>Received Invites</h5>
							{friendInvites.map(invite => (
								<div className="user-row" key={invite.requesterId}>
									{invite.requesterUsername}

									<div>
										<Button variant="success" onClick={() => handleAcceptInvite(invite.requesterId)}>Accept</Button>
										<Button variant="danger" onClick={() => handleDeclineInvite(invite.requesterId)}>Decline</Button>
									</div>
								</div>
							))}
						</div>

						<div id="your-friends-container">
							<h5>Your Friends</h5>
							{friends.length > 0 ?
								friends.map(friend => (
									<div className="user-row" key={friend.id}>{friend.username}</div>
								)) :
								<div>No friends yet :(</div>}
						</div>

						<div id="relevant-users-container">
							<div id="friend-username-container">
								<label htmlFor="friend-username">Search for friends here:</label>
								<input id="friend-username" value={friendUsername} onChange={handleFriendSearch}></input>
							</div>

							{relevantUsers.length > 0 && <h5>Relevant users</h5>}
							{relevantUsers.map(user => (
								<div className="user-row" key={user.id}>{user.username}
									{user.pendingInviteToUser ?
										<Button variant="danger" onClick={() => handleCancelInvite(user.id)}>Cancel request?</Button> :
										<Button onClick={() => handleSendFriendInvite(user.id)}>Add Friend</Button>}
								</div>
							))}
						</div>
					</div>
				</Card.Body>
			</Card>

			<Card id="puzzle-stats-card">
				<Card.Header>
					<h4>Puzzle Stats</h4>
				</Card.Header>
				<Card.Body>
					<div className="card-row">
						<p>Total puzzles solved: {profile?.puzzleStats?.totalSolved || 0}</p>
					</div>
					<div className="card-row">
						<p>Total failed puzzle attempts: {profile?.puzzleStats?.failedAttempts || 0}</p>
					</div>
					<div className="card-row">
						<p>Solved failed attempts: {profile?.puzzleStats?.solvedFailedAttempts || 0}</p>
					</div>
					<div className="card-row">
						<p>Best solved rating: {profile?.puzzleStats?.bestSolvedRating || 0}</p>
					</div>
					<div className="card-row">
						<p>Longest streak: {profile?.puzzleStats?.longestStreak || 0}</p>
					</div>
				</Card.Body>
			</Card>

			<Card id="chess-accounts-card">
				<Card.Header>
					<h4>Chess Accounts</h4>
				</Card.Header>

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