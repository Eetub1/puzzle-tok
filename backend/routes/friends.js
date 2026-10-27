import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import pool from "../db/db.js"

const friendsRouter = express.Router()
friendsRouter.use(authenticateToken)


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
    const pendingStatus = "pending"

    if (!addressee) {
        return res.status(400).json({ error: "Addressee is required" })
    }

    if (String(addressee) === String(requester)) {
        return res.status(400).json({ error: "You can't send a friend request to yourself" })
    }

    try {
        // first check here if you are already friends with this user
        let result = await pool.query(`
            SELECT 1 
            FROM friend_relations
            WHERE person_1 = $1 AND person_2 = $2 OR person_1 = $2 AND person_2 = $1`,
            [requester, addressee])

        // status 409 basically means that something already exists
        if (result.rowCount > 0) {
            return res.status(409).json({ error: "You are already friends with this user" })
        }

        // do you have an invite sent to that user, and the invite is still pending
        result = await pool.query(`
            SELECT 1
            FROM friend_invitations
            WHERE requester_id = $1 AND addressee_id = $2 AND invitation_status = $3`,
            [requester, addressee, pendingStatus])

        if (result.rowCount) {
            return res.status(409).json({ error: "You have already sent an invite to this user that is still pending" })
        }


        await pool.query(`
            INSERT INTO friend_invitations (requester_id, addressee_id, invitation_status)
            VALUES ($1, $2, $3)`,
            [requester, addressee, pendingStatus]
        )

        return res.status(201).json({ message: "Invitation sent" })
    } catch (error) {
        console.error("Error sending invite:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default friendsRouter