import express from "express"
import cors from "cors"
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})