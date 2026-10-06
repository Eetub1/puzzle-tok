import express, { json } from "express"
import pool from "../db/db.js"
const prefRouter = express.Router()

//TODO: refactor to only 1 function per reference

const changeColorPreference = async (user_id, color, difficulty) => {

    //TODO: refactor to 1 query
    const update_res = await pool.query(
        `UPDATE preferences SET color=$2 WHERE user_id=$1`,
        [user_id,color],
    )
    
    const insert_res = await pool.query(
        `INSERT INTO preferences (user_id, color, difficulty) SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT user_id FROM preferences P where P.user_id = $1)`,
        [user_id,color,difficulty],
    )

    console.log('update_res:', update_res)
    console.log('insert_res: ', insert_res)
}

const changeDifficultyPreference = async (user_id, color, difficulty) => {

    //TODO: refactor to 1 query
    const update_res = await pool.query(
        `UPDATE preferences SET difficulty=$2 WHERE user_id=$1`,
        [user_id,difficulty],
    )
    
    const insert_res = await pool.query(
        `INSERT INTO preferences (user_id, difficulty, color) SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT user_id FROM preferences P where P.user_id = $1)`,
        [user_id,color,difficulty],
    )

    console.log('update: ', update_res)
    console.log('insert', insert_res)
}

prefRouter.get("/", async (req, res) => {
    const z = await pool.query(
        'SELECT * FROM preferences;'
    )
    res.status(200).json(JSON.stringify(z.rows))
})

prefRouter.post("/", (req, res) => {
    const { user_id, color, difficulty } = req.body
    console.log('changed color for id',user_id, "color:", color)
    changeColorPreference(user_id, color, difficulty)
    changeDifficultyPreference(user_id, color, difficulty)
    return res.status(201).json({ color: color })
})

export default prefRouter