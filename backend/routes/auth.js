import express from "express"
import bcrypt from "bcrypt"
import pool from "../db/db.js"
import jwt from "jsonwebtoken"

const authRouter = express.Router()

const SALT_ROUNDS = 12
const UNIQUE_VIOLATION = "23505" // status code that postgreSQL returns if a user with the name already exists

authRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Username and password are required" })
    }

    const trimmedUsername = username.trim()

    if (trimmedUsername.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long" })
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" })
    }

    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

        const result = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
            [trimmedUsername, passwordHash],
        )
        const user = result.rows[0]

        return res.status(201).json({
            id: user.id,
            username: user.username,
        })
    } catch (error) {
        if (error.code === UNIQUE_VIOLATION) {
            // 409 basically means that there was a conflict while trying to create the resource
            return res.status(409).json({ error: "Username is already taken" })
        }

        return res.status(500).json({ error: "Something went wrong with signup" })
    }

    return res.status(201).json({ username: trimmedUsername })
})


authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Username and password are required" })
    }

    try {
        const result = await pool.query(
            "SELECT id, username, password_hash FROM users WHERE lower(username) = lower($1)",
            [username.trim()],
        )
        const user = result.rows[0]

        const passwordCorrect = user && await bcrypt.compare(password, user.password_hash)
    
        if (!passwordCorrect) {
            return res.status(401).json({ error: "Invalid username or password" })
        }

        // Create token that expires in 1 day
        const token = jwt.sign(
            { sub: String(user.id), // Subject, for who the token belongs to
                username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        )

        const resultObject = {
            token: token,
            id: user.id,
            username: user.username
        }

        return res.json(resultObject)
    } catch (error) {
        console.error("Login failed:", error)
        return res.status(500).json({ error: "Something went wrong with login" })
    }
})


export default authRouter