import pool from "../db/db.js"

// Route for saving failed puzzles
const savePuzzleAttempt = async (req, res) => {
    const { puzzleId, success } = req.body ?? {}
    
    if (!puzzleId) {
        return res.status(400).json({ error: "Puzzle ID is required" })
    }
    if (success !== false && success !== true) {
        return res.status(400).json({ error: "Success must exist and must be a boolean" })
    }
    try {
        const result = await pool.query(
            "INSERT INTO puzzle_attempts (user_id, puzzle_id, success) VALUES ($1, $2, $3)",
            [req.user.id, puzzleId, success]
        )
        res.json({ message: "Puzzle:" + puzzleId + " marked as attempted" })
    } catch (error) {
        console.error("Error saving puzzle to attempts:", error)
        res.status(500).json({ error: "Server error" })
    }
}

export { savePuzzleAttempt}