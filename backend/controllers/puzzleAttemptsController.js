import pool from "../db/db.js"
import calculatePuzzleRating from "../utils/puzzleRating.js"

const savePuzzleAttempt = async (req, res) => {
    const { puzzleId, puzzleRating, success } = req.body ?? {}
    
    if (!puzzleId) {
        return res.status(400).json({ error: "Puzzle ID is required" })
    }
    if(!puzzleRating) {
        return res.status(400).json({ error: "Puzzle rating is required"})
    }
    if (success !== false && success !== true) {
        return res.status(400).json({ error: "Success must exist and must be a boolean" })
    }
    try {
        await pool.query(
            "INSERT INTO puzzle_attempts (user_id, puzzle_id, puzzle_rating, success) VALUES ($1, $2, $3, $4)",
            [req.user.id, puzzleId, puzzleRating, success]
        )
        const playerRating = await pool.query(
            `SELECT puzzle_rating FROM users WHERE id = $1`,
            [req.user.id]
        )
        const countAttempted = await pool.query(
            `SELECT COUNT(*) AS attempt_count FROM puzzle_attempts WHERE user_id = $1`,
            [req.user.id]
        )
        const newPuzzleRating = calculatePuzzleRating(puzzleRating, success, playerRating.rows[0].puzzle_rating, countAttempted.rows[0].attempt_count)
        await pool.query(
            `UPDATE users
            SET puzzle_rating = $1
            WHERE id = $2`,
            [newPuzzleRating, req.user.id]
        )
        res.json({ message: "Puzzle:" + puzzleId + " marked as attempted" })
    } catch (error) {
        console.error("Error saving puzzle to attempts:", error)
        res.status(500).json({ error: "Server error" })
    }

}

export { savePuzzleAttempt}