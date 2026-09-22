import express from "express"
import cors from "cors"
const app = express()
const PORT = 3000

import gamesRouter from "./routes/games.js"
import oauthRouter from "./routes/oauth.js"
import puzzleRouter from "./routes/puzzles.js"

app.use(express.json())
app.use(cors())

app.use("/api/games", gamesRouter)
app.use("/api/auth", oauthRouter)
app.use("/api/puzzles", puzzleRouter)

app.get("/", (req, res) => {
    res.send("<a href='/api/auth/getAuth'>auth</a>")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})