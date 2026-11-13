import express, { json } from "express"
import pool from "../db/db.js"
const prefRouter = express.Router()

const updatePreferences = async (user_id, color, difficulty, failed, theme) => {

    const update_res = await pool.query(
        `UPDATE preferences SET color=$2, difficulty=$3, failed=$4, theme=$5  WHERE user_id=$1 `,
        [user_id,color, difficulty, failed, theme],
    )
    
    console.log('update_res:', update_res)
}

prefRouter.get("/", async (req, res) => {
    const z = await pool.query(
        'SELECT * FROM preferences;'
    )
    res.status(200).json(JSON.stringify(z.rows[0]))
})

prefRouter.post("/", (req, res) => {
    console.log('post body:',req.body)
    const { user_id, color, difficulty, failed, theme, opening } = req.body ?? {}

    console.log('changed preferences for id',user_id, "color:", color, "failed", failed, "theme",theme, "opening", opening)
    updatePreferences(user_id, color, difficulty, failed, theme, opening)

    return res.status(201).json({ color: color, difficulty: difficulty, failed: failed, theme: theme, opening: opening})
})

export default prefRouter
