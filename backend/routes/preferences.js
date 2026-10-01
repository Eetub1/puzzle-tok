import express, { json } from "express"
const prefRouter = express.Router()

prefRouter.get("/", (req, res) => {
    res.send("Users")
})

prefRouter.post("/", (req, res) => {
    const { color } = req.body
    console.log('changed color', color)
    return res.status(201).json({ color: color })
})

export default prefRouter