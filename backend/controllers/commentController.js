import pool from "../db/db.js"

// List comments of one puzzle, newest first
export const getComments = async (req, res) => {
    const { puzzleId } = req.params

    try {
        const result = await pool.query(
            `SELECT c.id, c.body, c.created_at, u.username, c.user_id
             FROM puzzle_comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.puzzle_id = $1
             ORDER BY c.created_at DESC
             LIMIT 100`,
            [puzzleId],
        )
        return res.json(result.rows.map(row => ({
            id: row.id,
            body: row.body,
            createdAt: row.created_at,
            username: row.username,
            own: String(row.user_id) === String(req.user.id), // lets the frontend show a delete button
        })))
    } catch (error) {
        console.error("Error retrieving comments:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

// Post a comment on a puzzle
export const addComment = async (req, res) => {
    const { puzzleId, body } = req.body ?? {}

    if (typeof puzzleId !== "string" || puzzleId === "" || puzzleId.length > 20) {
        return res.status(400).json({ error: "Puzzle id must be a non-empty string" })
    }

    const text = typeof body === "string" ? body.trim() : ""
    if (text.length < 1 || text.length > 200) {
        return res.status(400).json({ error: "Comment must be 1 to 200 characters" })
    }

    try {
        const result = await pool.query(
            `INSERT INTO puzzle_comments (user_id, puzzle_id, body)
             VALUES ($1, $2, $3)
             RETURNING id, body, created_at`,
            [req.user.id, puzzleId, text],
        )
        const comment = result.rows[0]
        return res.status(201).json({
            id: comment.id,
            body: comment.body,
            createdAt: comment.created_at,
            username: req.user.username,
            own: true,
        })
    } catch (error) {
        console.error("Error adding comment:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

// Delete your own comment
export const removeComment = async (req, res) => {
    const { commentId } = req.params

    if (!/^\d+$/.test(commentId)) {
        return res.status(400).json({ error: "Invalid comment id" })
    }

    try {
        const result = await pool.query(
            `DELETE FROM puzzle_comments
             WHERE id = $1 AND user_id = $2`,
            [commentId, req.user.id],
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Comment not found" })
        }
        return res.status(204).end()
    } catch (error) {
        console.error("Error removing comment:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
}