import pool from "../db/db.js"


// Route for saving failed puzzles
const saveFailedPuzzle = async (req, res) => {
    const { puzzleId } = req.body ?? {}
    
    if (!puzzleId) {
        return res.status(400).json({ error: "Puzzle ID is required" })
    }
    try {
        const result = await pool.query(
            "INSERT INTO failed_puzzles (user_id, puzzle_id) VALUES ($1, $2) ON CONFLICT (user_id, puzzle_id) DO NOTHING RETURNING id",
            [req.user.id, puzzleId]
        )
        if(result.rows.length === 0) {
            console.log("Puzzle:", puzzleId, " already marked as failed for user:", req.user.id)
            return res.status(200).json({message: "Puzzle already marked as failed"})
        }
        res.json({ message: "Puzzle:" + puzzleId + " marked as failed" })
    } catch (error) {
        console.error("Error saving puzzle to failed puzzles:", error)
        res.status(500).json({ error: "Server error" })
    }
}

// Route for retrieving failed puzzles
const getFailedPuzzle = async (req, res) => {
    console.log("Retrieving failed puzzles")
    try {
        const result = await pool.query(
            "SELECT puzzle_id FROM failed_puzzles WHERE user_id = $1",
            [req.user.id]
        )
        res.json(result.rows.map(row => row.puzzle_id))
    } catch (error) {
        console.error("Error retrieving failed puzzles:", error)
        res.status(500).json({ error: "Server error" })
    }
}

// Route for removing failed puzzle
const removeFailedPuzzle = async (req, res) => {
    const { puzzleId } = req.params
    try {
        const result = await pool.query(
            "DELETE FROM failed_puzzles WHERE user_id = $1 AND puzzle_id = $2 RETURNING id",
            [req.user.id, puzzleId]
        )
        if (result.rows.length === 0) {
            return res.status(200).json({ message: "Puzzle not found in failed puzzles" })
        }
        res.json({ message: "Puzzle: " + puzzleId + " removed from failed puzzles" })
    } catch (error) {
        console.error("Error removing puzzle from failed puzzles:", error)
        res.status(500).json({ error: "Server error" })
    }
}

export { saveFailedPuzzle, getFailedPuzzle, removeFailedPuzzle }