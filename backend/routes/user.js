import express from "express"
import pool from "../db/db.js"
import { authenticateToken } from "../middleware/auth.js"

MAX_GAMES_PER_SITE = 50

const userRouter = express.Router()

userRouter.use(authenticateToken) // All routes in this router require authentication

userRouter.post("/chess-accounts", async (req, res) => {
    const { usernames } = req.body ?? {}

    if (typeof usernames !== "object" || usernames === null) {
        return res.status(400).json({ error: "Usernames must be an object" })
    }

    const { lichess, chessCom } = usernames // one of these is allowed to be empty string

    if (typeof lichess !== "string" || typeof chessCom !== "string") {
        return res.status(400).json({ error: "Lichess and Chess.com usernames must be strings" })
    }

    if (lichess === "" && chessCom === "") {
        return res.status(400).json({ error: "At least one of Lichess or Chess.com username must be provided" })
    }

    try {
        const result = await pool.query(
            `UPDATE users 
             SET lichess_username = $1, 
             chesscom_username = $2 
             WHERE id = $3
             RETURNING lichess_username, chesscom_username`,
            [lichess, chessCom, req.user.id],
        )
        const accounts = result.rows[0]

        if (!accounts) {
            return res.status(404).json({ error: "User not found" })
        }

        return res.json({
            lichess: accounts.lichess_username,
            chessCom: accounts.chesscom_username,
        })
    } catch (error) {
        console.error("Error updating chess accounts:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


userRouter.get("/profile", async (req, res) => {
    const user = req.user // The user is set into the req object in the middleware

    try {
        const result = await pool.query(`
            SELECT email, email_verified_at, username, lichess_username, chesscom_username
            FROM users
            WHERE id = $1`, 
            [user.id]
        )
        const profile = result.rows[0]
        
        if (!profile) {
            return res.status(404).json({ error: "User not found" })
        }

        return res.json({
            email: profile.email_verified_at ? profile.email : null, // Only return email if it has been verified
            username: profile.username,
            lichess: profile.lichess_username,
            chessCom: profile.chesscom_username,
        })
    } catch (error) {
        console.log("Error retrieving user profile:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


userRouter.get("/games", async (req, res) => {
    const user = req.user
    let limit = parseInt(req.query.limit) || 10 // Default limit is 10
    if (limit > MAX_GAMES_PER_SITE) limit = MAX_GAMES_PER_SITE
    if (limit < 1) limit = 1

    try {
        const result = await pool.query(`
            SELECT lichess_username, chesscom_username
            FROM users
            WHERE id = $1`, 
            [user.id]
        )
        const accounts = result.rows[0]

        if (!accounts) {
            return res.status(404).json({ error: "User not found" })
        }

        const { lichess_username, chesscom_username } = accounts

        // TODO: GET GAMES HERE
        return res.json({})
    } catch (error) {
        console.error("Error retrieving user games:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default userRouter