import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import pool from "../db/db.js"

const friendsRouter = express.Router()
friendsRouter.use(authenticateToken)

const PENDING_STATUS = "pending"
const REJECTED_STATUS = "rejected"
const ACCEPTED_STATUS = "accepted"


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
        const users = await pool.query(
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
        
        // need to search friend_invitations table to see if you have already sent an invite
        const processedUsers = await Promise.all(users.rows.map(async row => {
            const status = await pool.query(`
                SELECT invitation_status
                FROM friend_invitations
                WHERE requester_id = $1 AND addressee_id = $2`,
                [userId, row.id]
            )
        
            const user = {
                id: row.id, 
                username: row.username,
                pendingInviteToUser: status.rows[0]?.invitation_status === PENDING_STATUS
            }
            return user
        }))
        
        return res.json(processedUsers)
    } catch (error) {
        console.error("Error searching users:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


friendsRouter.get("/", async (req, res) => {
    const userId = req.user.id

    try {
        const result = await pool.query(`
            SELECT u.id, u.username
            FROM friend_relations fr
            JOIN users u
                ON u.id = CASE WHEN fr.person_1 = $1 THEN fr.person_2 ELSE fr.person_1 END
            WHERE fr.person_1 = $1 OR fr.person_2 = $1
            ORDER BY lower(u.username)`,
            [userId]
        )

        return res.json(result.rows)
    } catch (error) {
        console.error("Error fetching friends:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


friendsRouter.get("/invitation", async (req, res) => {
    const userId = req.user.id

    try {
        const result = await pool.query(`
            SELECT fi.requester_id, u.username AS requester_username
            FROM friend_invitations fi
            JOIN users u ON u.id = fi.requester_id
            WHERE fi.addressee_id = $1 AND fi.invitation_status = $2`,
            [userId, PENDING_STATUS]
        )
        console.log(result.rows)
        const data = result.rows.map(row => (
            { 
                requesterId: row.requester_id, 
                username: row.username,
                requesterUsername: row.requester_username
            }
        ))

        return res.json(data)
    } catch (error) {
        console.error("Error fetching invite:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


friendsRouter.post("/invitation", async (req, res) => {
    const { addressee } = req.body ?? {}
    const requester = req.user.id

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

        // do you have an invite sent to that user, and is the invite still pending
        result = await pool.query(`
            SELECT 1
            FROM friend_invitations
            WHERE requester_id = $1 AND addressee_id = $2 AND invitation_status = $3`,
            [requester, addressee, PENDING_STATUS])

        if (result.rowCount) {
            return res.status(409).json({ error: "You have already sent an invite to this user that is still pending" })
        }


        await pool.query(`
            INSERT INTO friend_invitations (requester_id, addressee_id, invitation_status)
            VALUES ($1, $2, $3)`,
            [requester, addressee, PENDING_STATUS]
        )

        return res.status(201).json({ message: "Invitation sent" })
    } catch (error) {
        console.error("Error sending invite:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


// This id parameter is the id of the person to who you have sent a friend request
// and want to cancel it now
friendsRouter.delete("/invitation/:id", async (req, res) => {
    const addressee = req.params.id
    const requester = req.user.id

    try {
        const result = await pool.query(`
            DELETE FROM friend_invitations
            WHERE addressee_id = $1 AND requester_id = $2`,
            [addressee, requester],
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Invitation not found" })
        }

        return res.json({ message: "Succesfully cancelled invitation" })
    } catch (error) {
        console.error("Error deleting invitation:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default friendsRouter