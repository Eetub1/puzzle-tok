import express from "express"
import pool from "../db/db.js"
import { authenticateToken } from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.use(authenticateToken)

// Route for saving failed puzzles
userRouter.post("/failed", async (req, res) => {
    const { puzzleId } = req.body ?? {}
    
    if (!puzzleId) {
        return res.status(400).json({ error: "Puzzle ID is required" })
    }
    try {
        const result = await pool.query(
            "INSERT INTO failed_puzzles (user_id, puzzle_id) VALUES ($1, $2) RETURNING id",
            [req.user.id, puzzleId]
        )
        console.log("Puzzle:", puzzleId, " marked as failed for user:", req.user.id)
        res.json({ id: result.rows[0].id, user_id: req.user.id, puzzle_id: puzzleId })
    } catch (error) {
        if (error.code === "23505") { 
            console.warn("Puzzle:", puzzleId, "already marked as failed for user:", req.user.id)
            return res.status(409).json({ error: "Puzzle already saved to failed" })
        }
        console.error("Error saving puzzle to failed puzzles:", error)
        res.status(500).json({ error: "Server error" })
    }
})

// Route for retrieving failed puzzles
userRouter.get("/failed", async (req, res) => {
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
})

export default userRouter
