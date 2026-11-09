import { useState, useEffect } from "react"
import { Card } from "react-bootstrap"
import "./Profile.css"
import { updateUserChessAccounts, getUserProfile } from "../services/userService"
import { resendEmailVerification } from "../services/userService"

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
    }, [setMessage]) // this shouldnt be a dependency, but eslint is complaining about it


    const handleSendVerification = async () => {
        // This should send a new verification email to the user
        try {
            const result = await resendEmailVerification()
            console.log(result)
            setMessage({ message: "Email verification link resent!", isError: false})
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        } catch (error) {
            console.log("Couldn't resend email verification link: " + error)
            setMessage({ message: "Couldn't resend email verification link: " + error, isError: true})
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        }
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
            <h2 className="profile-title">Account Settings</h2>

            <Card className="profile-card">
                <Card.Header className="profile-card-header">Account</Card.Header>
                <Card.Body className="profile-card-body">
                    <div className="card-row">
                        <span className="row-label">Username</span>
                        <span className="row-value">{profile?.username || "—"}</span>
                    </div>

                    <div className="card-row">
                        <span className="row-label">Email</span>
                        <span className="row-value">{profile?.email || "—"}</span>
                    </div>

                    <div className="card-row status-row">
                        <span className="row-label">Email Status</span>
                        <div className="status-container">
                            {profile?.emailVerified ? (
                                <span className="status-badge verified">✓ Verified</span>
                            ) : (
                                <>
                                    <span className="status-badge unverified">Unverified</span>
                                    <button 
                                        id="send-verification-btn" 
                                        type="button" 
                                        className="verify-btn" 
                                        onClick={handleSendVerification}
                                    >
                                        Send verification email
                                    </button>
                                </>
                            )}
                        </div>
                    </div>


                </Card.Body>
            </Card>
            <Card className="profile-card">
                <Card.Header className="profile-card-header">Chess Accounts</Card.Header>

                <Card.Body className="profile-card-body">
                    <div className="card-row">
                        <p className="card-description">Connect your accounts so we can turn your games into puzzles</p>
                    </div>

                    <div className="card-row edit-row">
                        <label className="row-label" htmlFor="lichess">Lichess</label>
                        {editingLichess ? (
                            <form className="inline-edit-form" onSubmit={(event) => { event.preventDefault(); handleLichessEdit(false) }}>
                                <input 
                                    id="lichess" 
                                    type="text" 
                                    className="profile-input"
                                    onChange={(event) => setLichess(event.target.value)} 
                                    value={lichess}
                                    autoFocus
                                />
                                <button className="action-btn confirm" type="submit">confirm</button>
                                <button className="action-btn cancel" type="button" onClick={() => setEditingLichess(false)}>cancel</button>
                            </form>
                        ) : (
                            <div className="account-value-group">
                                <span className={`account-name ${!profile?.lichess ? "empty" : ""}`}>
                                    {profile?.lichess || "Not connected"}
                                </span>
                                <button className="action-btn edit" onClick={() => handleLichessEdit(true)}>edit</button>
                            </div>
                        )}
                    </div>

                    <div className="card-row edit-row">
                        <label className="row-label" htmlFor="chessCom">Chess.com</label>
                        {editingChessCom ? (
                            <form className="inline-edit-form" onSubmit={(event) => { event.preventDefault(); handleChessComEdit(false) }}>
                                <input 
                                    id="chessCom" 
                                    type="text" 
                                    className="profile-input"
                                    onChange={(event) => setChessCom(event.target.value)} 
                                    value={chessCom} 
                                    autoFocus
                                />
                                <button className="action-btn confirm" type="submit">confirm</button>
                                <button className="action-btn cancel" type="button" onClick={() => setEditingChessCom(false)}>cancel</button>
                            </form>
                        ) : (
                            <div className="account-value-group">
                                <span className={`account-name ${!profile?.chessCom ? "empty" : ""}`}>
                                    {profile?.chessCom || "Not connected"}
                                </span>
                                <button className="action-btn edit" onClick={() => handleChessComEdit(true)}>edit</button>
                            </div>
                        )}
                    </div>

                </Card.Body>
            </Card>

            <div className="profile-footer">
                <button id="logout-btn" onClick={handleLogout}>log out</button>
            </div>
        </div>
    )
}

export default Profile