import express, { json } from "express"
import pool from "../db/db.js"
const prefRouter = express.Router()
const allowed_colors = ['WHITE','BLACK', 'BOTH']
const allowed_difficulty = ['EASIEST','EASIER', 'NORMAL', 'HARDER', 'HARDEST']

//TODO: refactor to only 1 function per reference

const changeColorPreference = async (user_id, color, difficulty, failed) => {

    //TODO: refactor to 1 query
    const update_res = await pool.query(
        `UPDATE preferences SET color=$2 WHERE user_id=$1`,
        [user_id,color],
    )
    
    const insert_res = await pool.query(
        `INSERT INTO preferences (user_id, color, difficulty, failed) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT user_id FROM preferences P where P.user_id = $1)`,
        [user_id,color,difficulty, failed],
    )

    console.log('update_res:', update_res)
    console.log('insert_res: ', insert_res)
}

const changeDifficultyPreference = async (user_id, color, difficulty, failed) => {

    //TODO: refactor to 1 query
    const update_res = await pool.query(
        `UPDATE preferences SET difficulty=$2 WHERE user_id=$1`,
        [user_id,difficulty],
    )
    
    const insert_res = await pool.query(
        `INSERT INTO preferences (user_id, color, difficulty, failed) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT user_id FROM preferences P where P.user_id = $1)`,
        [user_id,difficulty,color,failed],
    )

    //console.log('update: ', update_res)
    //console.log('insert', insert_res)
}


const changeFailedPreference = async (user_id, color, difficulty, failed) => {

    //TODO: refactor to 1 query
    const update_res = await pool.query(
        `UPDATE preferences SET failed=$2 WHERE user_id=$1`,
        [user_id,failed],
    )
    
    const insert_res = await pool.query(
        `INSERT INTO preferences (user_id, color, difficulty, failed) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT user_id FROM preferences P where P.user_id = $1)`,
        [user_id,difficulty,color, failed],
    )

    //console.log('update: ', update_res)
    //console.log('insert', insert_res)
}

prefRouter.get("/", async (req, res) => {
    const z = await pool.query(
        'SELECT * FROM preferences;'
    )
    res.status(200).json(JSON.stringify(z.rows[0]))
})

prefRouter.post("/", (req, res) => {
    console.log('post body:',req.body)
    const { user_id, color, difficulty, failed } = req.body ?? {}
    console.log('post failed:', failed)
    console.log('post color:', color)
    console.log('post diffi:', difficulty)

    if (!allowed_colors.includes(color.toUpperCase())) {
        return res.status(400).json({ error: "Unknown color" })
    }

    if (!allowed_difficulty.includes(difficulty.toUpperCase())) {
        return res.status(400).json({ error: "Unknown difficulty" })
    }

    console.log('changed color for id',user_id, "color:", color, "failed", failed)
    changeColorPreference(user_id, color, difficulty, failed)
    changeDifficultyPreference(user_id, color, difficulty, failed)
    changeFailedPreference(user_id, color, difficulty,failed)
    return res.status(201).json({ color: color, difficulty: difficulty, failed: failed})
})

export default prefRouter
