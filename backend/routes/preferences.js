import express, { json } from "express"
import pool from "../db/db.js"
const prefRouter = express.Router()

const changeColorPreference = async (user_id, color) => {

    const result = await pool.query(
        `INSERT INTO preferences (user_id, color) VALUES ($1,$2)`, // add expire hours to current time
        [color,user_id],
    )

    console.log(result)

}

prefRouter.get("/", async (req, res) => {
    const z = await pool.query(
        'SELECT * FROM preferences;'
    )
    res.status(200).json(JSON.stringify(z.rows))
})

prefRouter.post("/", (req, res) => {
    const { color, user_id } = req.body
    console.log('changed color for id',user_id, "color:", color)
    changeColorPreference(color, user_id)
    return res.status(201).json({ color: color })
})

export default prefRouter