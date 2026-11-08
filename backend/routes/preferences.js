import express, { json } from "express"
import pool from "../db/db.js"
const prefRouter = express.Router()
const allowed_colors = ['WHITE','BLACK', 'BOTH']
const allowed_difficulty = ['EASIEST','EASIER', 'NORMAL', 'HARDER', 'HARDEST']

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
    const { user_id, color, difficulty, failed, theme } = req.body ?? {}
    console.log('post failed:', failed)
    console.log('post color:', color)
    console.log('post diffi:', difficulty)
    console.log('post theme:', theme)

    if (!allowed_colors.includes(color.toUpperCase())) {
        return res.status(400).json({ error: "Unknown color" })
    }

    if (!allowed_difficulty.includes(difficulty.toUpperCase())) {
        return res.status(400).json({ error: "Unknown difficulty" })
    }

    console.log('changed preferences for id',user_id, "color:", color, "failed", failed, "theme",theme)
    updatePreferences(user_id, color, difficulty,failed, theme)

    return res.status(201).json({ color: color, difficulty: difficulty, failed: failed, theme: theme})
})

export default prefRouter
