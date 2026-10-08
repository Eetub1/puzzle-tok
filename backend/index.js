import express from "express"
import cors from "cors"
import pool from "./db/db.js"
import cookieParser from "cookie-parser" 
const app = express()
const PORT = 3000

import authRouter from "./routes/auth.js"
import oauthRouter from "./routes/oauth.js"
import puzzlesRouter from "./routes/puzzles.js"
import userRouter from "./routes/user.js"

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/puzzles", puzzlesRouter)
app.use("/api/auth", oauthRouter)
app.use("/api/user", userRouter)

app.get("/", (req, res) => {
    //res.send("<a href='/api/auth/getAuth'>auth</a>")
    res.send("Hello World")
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