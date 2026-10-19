import express from "express"
import pool from "../db/db.js"
import { authenticateToken } from "../middleware/auth.js"
import { getLichessGames, getChessComGames } from "../utils/games.js"
import { saveFailedPuzzle, getFailedPuzzle, removeFailedPuzzle } from "../controllers/failedPuzzleController.js"
import { savePuzzleAttempt } from "../controllers/puzzleAttemptsController.js"

const userRouter = express.Router()

const MAX_GAMES_PER_SITE = 50

userRouter.use(authenticateToken)

userRouter.post("/failed", saveFailedPuzzle)
userRouter.get("/failed", getFailedPuzzle)
userRouter.delete("/failed/:puzzleId", removeFailedPuzzle)

userRouter.post("/puzzle-attempts", savePuzzleAttempt)


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

        const result2 = await pool.query(`
            SELECT COUNT(*) AS total_attempts,
                SUM(CASE WHEN success THEN 1 ELSE 0 END) AS successful_attempts
            FROM puzzle_attempts
            WHERE user_id = $1`, 
            [user.id]
            
        )
        const puzzleStats = result2.rows[0]

        const result3 = await pool.query(`
            SELECT COUNT(*) AS total_attempts,
                SUM(CASE WHEN success THEN 0 ELSE 1 END) AS failed_attempts
            FROM puzzle_attempts
            WHERE user_id = $1`, 
            [user.id]
        )
        const failedAttempts = result3.rows[0]

        const result4 = await pool.query(`
            SELECT COUNT(DISTINCT solved.puzzle_id) AS solved_failed_attempts
            FROM puzzle_attempts AS solved
            WHERE solved.user_id = $1
                AND solved.success = TRUE
                AND EXISTS (
                    SELECT 1
                    FROM puzzle_attempts AS failed
                    WHERE failed.user_id = solved.user_id
                        AND failed.puzzle_id = solved.puzzle_id
                        AND failed.success = FALSE
                        AND (failed.created_at, failed.id) < (solved.created_at, solved.id)
                )`,
            [user.id]
        )
        const solvedFailedAttempts = result4.rows[0]

        const result5 = await pool.query(`
            SELECT puzzle_rating AS best_rating
            FROM puzzle_attempts
            WHERE user_id = $1 AND success = TRUE
            ORDER BY puzzle_rating DESC
            LIMIT 1`,
            [user.id]
        )
        const bestSolvedRating = result5.rows[0]


        return res.json({
            email: profile.email,
            emailVerified: profile.email_verified_at !== null,
            username: profile.username,
            lichess: profile.lichess_username,
            chessCom: profile.chesscom_username,
            puzzleStats: {
                totalSolved: puzzleStats.successful_attempts,
                failedAttempts: failedAttempts.failed_attempts,
                solvedFailedAttempts: solvedFailedAttempts.solved_failed_attempts,
                bestSolvedRating: bestSolvedRating?.best_rating ?? 0,
                longestStreak: 0, 
            },
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
