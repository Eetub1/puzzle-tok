import express from "express"
import pool from "../db/db.js"
import { authenticateToken } from "../middleware/auth.js"

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
        await pool.query(
            `UPDATE users SET lichess_username = $1, chesscom_username = $2 WHERE id = $3`,
            [lichess, chessCom, req.user.id],
        )
        return res.status(200).json({ message: "Chess accounts updated successfully" })
    } catch (error) {
        console.error("Error updating chess accounts:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default userRouter