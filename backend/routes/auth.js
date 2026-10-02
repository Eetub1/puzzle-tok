import express from "express"
import bcrypt from "bcrypt"
import pool from "../db/db.js"
import jwt from "jsonwebtoken"
import crypto from "node:crypto"
import { sendMail } from "../utils/mail.js"

const authRouter = express.Router()

const TIME_TO_VERIFY_EMAIL_HOURS = 24
const SALT_ROUNDS = 12
const UNIQUE_VIOLATION = "23505" // status code that postgreSQL returns if a user with the name already exists


const hashToken = token => crypto.createHash("sha256").update(token).digest("hex")


const sendVerificationEmail = async user => {
    // Create a verification token, which the user sends back after clicking the verification link
    const token = crypto.randomBytes(32).toString("hex")
    // Need to create a hash of the token. Can't store it directly in the database
    const hashedToken = hashToken(token)

    await pool.query(
        `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, now() + make_interval(hours => $3))`, // add expire hours to current time
        [user.id, hashedToken, TIME_TO_VERIFY_EMAIL_HOURS],
    )

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

    await sendMail({
        to: user.email,
        subject: "Verify your PuzzleTok email address",
        text: `Link to verify your email address:\n${verifyUrl}\n\n`
            + `The link is valid for ${TIME_TO_VERIFY_EMAIL_HOURS} hours. `
    })
}


authRouter.post("/signup", async (req, res) => {
    const { username, email, password } = req.body ?? {}

    if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Username, email and password are required" })
    }

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()

    if (trimmedUsername.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters long" })
    }

    if (trimmedEmail.length < 3) {
        return res.status(400).json({ error: "Email must be at least 3 characters long" })
    }

    if (trimmedEmail.length > 254) {
        return res.status(400).json({ error: "Email must be less than 254 characters long" })
    }

    if (!trimmedEmail.includes("@")) {
        return res.status(400).json({ error: "Email missing @ symbol" })
    }

    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" })
    }

    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

        const result = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
            [trimmedUsername, trimmedEmail, passwordHash],
        )

        const user = result.rows[0]
        await sendVerificationEmail(user)

        return res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.created_at
        })
    } catch (error) {
        if (error.code === UNIQUE_VIOLATION) {
            // 409 basically means that there was a conflict while trying to create the resource
            return res.status(409).json({ error: "Username or email is already taken" })
        }

        return res.status(500).json({ error: "Something went wrong with signup" })
    }
})


authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body ?? {}

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Username and password are required" })
    }

    try {
        const result = await pool.query(
            "SELECT id, email, username, password_hash FROM users WHERE lower(username) = lower($1)",
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
            email: user.email,
            username: user.username
        }

        return res.json(resultObject)
    } catch (error) {
        console.error("Login failed:", error)
        return res.status(500).json({ error: "Something went wrong with login" })
    }
})


authRouter.post("/verify-email", async (req, res) => {
    // user gives their token when verifying email
    const { token } = req.body ?? {}

    if (typeof token !== "string" || token === "") {
        return res.status(400).json({ error: "Verification token is missing" })
    }

    // Create a separate connection to database so we can rollback changes if they fail
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        // Mark the verification token as used
        const result = await client.query(
            `UPDATE email_verification_tokens
             SET used_at = now()
             WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
             RETURNING user_id`,
            [hashToken(token)],
        )
        const verificationToken = result.rows[0]

        if (!verificationToken) {
            await client.query("ROLLBACK") // Take changes back, something failed
            return res.status(400).json({ error: "The verification link is invalid or has expired" })
        }

        await client.query(
            "UPDATE users SET email_verified_at = now() WHERE id = $1 AND email_verified_at IS NULL",
            [verificationToken.user_id],
        )

        await client.query("COMMIT") // Finish the changes
        return res.json({ message: "Your email address has been verified" })
    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Email verification failed:", error)
        return res.status(500).json({ error: "Something went wrong" })
    } finally {
        client.release() // return the connection back to pool
    }
})


export default authRouter