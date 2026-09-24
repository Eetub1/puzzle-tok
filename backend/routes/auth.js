import express from "express"
const authRouter = express.Router()

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

    // TODO: need to hash password and store user in database

    return res.status(201).json({ username: trimmedUsername })
})

export default authRouter