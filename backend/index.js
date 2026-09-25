import express from "express"
import cors from "cors"
import pool from "./db/db.js"
const app = express()
const PORT = 3000

import gamesRouter from "./routes/games.js"
import authRouter from "./routes/auth.js"
import puzzlesRouter from "./routes/puzzles.js"

app.use(express.json())
app.use(cors())

app.use("/api/games", gamesRouter)
app.use("/api/auth", authRouter)
app.use("/api/puzzles", puzzlesRouter)


app.get("/", (req, res) => {
    res.send("Hello world!")
})

try {
    await pool.query("SELECT 1")
    console.log("Connected to database")
} catch (error) {
    console.log("Could not connect to database:", error.message)
    process.exit(1) // End with a failure because couldn't reach database
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})