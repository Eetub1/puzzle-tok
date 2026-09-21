import express from "express"
const gamesRouter = express.Router()

gamesRouter.get("/", (req, res) => {
    // Can unpack other websites here if or when we add support to other sites
    const { chessCom, lichess} = req.query

    if (!chessCom && !lichess) {
        return res.status(400).json({ error: "At least one username is required" })
    }
    return res.json("GOOD JOB!")
})


export default gamesRouter