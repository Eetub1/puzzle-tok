import express from "express"
import pool from "../db/db.js"
import { authenticateToken } from "../middleware/auth.js"
import { getLichessGames, getChessComGames } from "../utils/games.js"

const userRouter = express.Router()

const MAX_GAMES_PER_SITE = 50

userRouter.use(authenticateToken)

// Route for saving failed puzzles
userRouter.post("/failed", async (req, res) => {
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

// Route for removing failed puzzle
userRouter.delete("/failed/:puzzleId", async (req, res) => {
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
})

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
        const result = await pool.query(
            `UPDATE users 
             SET lichess_username = $1, 
             chesscom_username = $2 
             WHERE id = $3
             RETURNING lichess_username, chesscom_username`,
            [lichess, chessCom, req.user.id],
        )
        const accounts = result.rows[0]

        if (!accounts) {
            return res.status(404).json({ error: "User not found" })
        }

        return res.json({
            lichess: accounts.lichess_username,
            chessCom: accounts.chesscom_username,
        })
    } catch (error) {
        console.error("Error updating chess accounts:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


userRouter.get("/profile", async (req, res) => {
    const user = req.user // The user is set into the req object in the middleware

    try {
        const result = await pool.query(`
            SELECT email, email_verified_at, username, lichess_username, chesscom_username
            FROM users
            WHERE id = $1`, 
            [user.id]
        )
        const profile = result.rows[0]
        
        if (!profile) {
            return res.status(404).json({ error: "User not found" })
        }

        return res.json({
            email: profile.email_verified_at ? profile.email : null, // Only return email if it has been verified
            username: profile.username,
            lichess: profile.lichess_username,
            chessCom: profile.chesscom_username,
        })
    } catch (error) {
        console.log("Error retrieving user profile:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})


userRouter.get("/games", async (req, res) => {
    const user = req.user
    let limit = parseInt(req.query.limit) || 10 // Default limit is 10
    if (limit > MAX_GAMES_PER_SITE) limit = MAX_GAMES_PER_SITE
    if (limit < 1) limit = 1

    try {
        const result = await pool.query(`
            SELECT lichess_username, chesscom_username
            FROM users
            WHERE id = $1`, 
            [user.id]
        )
        const accounts = result.rows[0]

        if (!accounts) {
            return res.status(404).json({ error: "User not found" })
        }

        // rename variables
        const { lichess_username: lichessUsername, chesscom_username: chessComUsername } = accounts

        const games = []

        if (lichessUsername) {
            try {
                const lichessGames = await getLichessGames(lichessUsername, limit)
                games.push(...lichessGames)
            } catch (error) {
                return res.status(502).json({ error: error.message })
            }
        }

        if (chessComUsername) {
            try {
                const chessComGames = await getChessComGames(chessComUsername, limit)
                games.push(...chessComGames)
            } catch (error) {
                return res.status(502).json({ error: error.message })
            }
        }

        return res.json(games)
    } catch (error) {
        console.error("Error retrieving user games:", error)
        return res.status(500).json({ error: "Internal server error" })
    }
})

export default userRouter
