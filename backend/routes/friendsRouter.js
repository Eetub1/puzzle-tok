import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import pool from "../db/db.js"

const friendsRouter = express.Router()
friendsRouter.use(authenticateToken)

friendsRouter.get("/search", async (req, res) => {
    const { query } = req.query
    const userId = req.user.id

    if (typeof query !== "string") {
        return res.status(400).json({ error: "Query is not type string" })
    }

    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 3) {
        return res.json([])
    }

    // Escape LIKE wildcards so that % and _ in the input are matched literally
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
             LIMIT 7`,
            [escapedQuery, userId, trimmedQuery],
        )

        return res.json(result.rows)
    } catch (error) {
        console.error("Error searching users:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default friendsRouter