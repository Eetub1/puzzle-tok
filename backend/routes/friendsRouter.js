import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import pool from "../db/db.js"

const friendsRouter = express.Router()
friendsRouter.use(authenticateToken)

const FOREIGN_KEY_VIOLATION = "23503"
const UNIQUE_VIOLATION = "23505"

friendsRouter.get("/search", async (req, res) => {
    const { query } = req.query ?? {}
    const userId = req.user.id

    if (typeof query !== "string") {
        return res.status(400).json({ error: "Query is not of type string" })
    }

    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
        return res.json([])
    }

    // Escape LIKE wildcards so that % and _ in the input are matched literally, thanks AI
    const escapedQuery = trimmedQuery.replace(/[\\%_]/g, "\\$&")

    try {
        const result = await pool.query(
           `SELECT id, username
            FROM users
            WHERE lower(username) LIKE lower($1) || '%'
            AND id <> $2
            ORDER BY lower(username) = lower($3) DESC,
                char_length(username),
                username
            LIMIT 10`,
            [escapedQuery, userId, trimmedQuery],
        )

        // TODO: this also needs a way to search if you have already added these specific people

        return res.json(result.rows)
    } catch (error) {
        console.error("Error searching users:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


friendsRouter.post("/invitation", async (req, res) => {
    const { addressee } = req.body ?? {}
    const requester = req.user.id
    const status = "pending"

    // TODO: need to validate addressee and check that its not the same as requester
    // and also a bunch of other stuff

    try {
        await pool.query(`
            INSERT INTO friend_invitations (requester_id, addressee_id, invitation_status)
            VALUES ($1, $2, $3)`,
            [requester, addressee, status]
        )

        return res.status(201).json({ message: "Invitation sent" })
    } catch (error) {
        console.error("Error sending invite:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default friendsRouter