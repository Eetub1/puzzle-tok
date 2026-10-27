import express, { response } from "express"
import { Chess } from "chess.js"
const puzzlesRouter = express.Router()
const base_url = `https://lichess.org`
import pool from "../db/db.js"

// Form batch of accurately filtered puzzles
const getFilteredBatch = async (req) => {

    let query = new URLSearchParams({})

    if (req.query.color === 'both') {
        query = new URLSearchParams({
            "difficulty": req.query.difficulty,
            "nb": 5
        })
    } else {
        query = new URLSearchParams({
            "difficulty": req.query.difficulty,
            "nb": 1, 
            "color": req.query.color
        })
    }

    console.log("Sending multiple puzzles")

    let response = await fetch(`${base_url}/api/puzzle/batch/mix?${query}`)

    const json = await response.json()
    console.log(json)

    if (!response.ok) {
        throw new Error(`Lichess request failed: ${response.status}`)
    }

    return json.puzzles
}

// Form batch of failed puzzles
const getFailedBatch = async (user_id) => {

    console.log("Retrieving batch of failed puzzles")

    let failed_puzzles = []

    const failed = await getFailedPuzzles(user_id)

    for (let i = 0; i < failed.length; i++) {
        failed_puzzles.push(await getGameById(failed[i].puzzle_id))
    }
    //console.log('FORMED FAILED', failed_puzzles)
    return failed_puzzles
}

// Retrieve failed puzzles from db
const getFailedPuzzles = async (user_id) => {

    console.log("Retrieving failed puzzles from db")

    const result = await pool.query(
        `SELECT * FROM failed_puzzles WHERE user_id=$1`,
        [user_id],
    )

    if(!result.rowCount === 0) {
        console.log('No failed puzzles yet!')
    }

    console.log('failed puzzles', result.rows)

    return result.rows
}

// Retrieve a puzzle by id from Lichess
const getGameById = async id => {

    //console.log("Retrieving game by id from Lichess")

    let response = await fetch(`${base_url}/api/puzzle/${id}`)

    if (!response.ok) {
		throw new Error(`Lichess request failed: ${response.status}`)
	}

    return await response.json()
}

// Route for retrieving daily puzzle
puzzlesRouter.get('/daily', async (req,res) => {

    console.log("Sending daily puzzle")

    let response = await fetch(`${base_url}/api/puzzle/daily`)
    res.send(await response.json())
})

// Route for retrieving next puzzle
puzzlesRouter.get('/next', async (req,res) => {

    console.log("Sending next puzzle")
    

    let response = await fetch(`${base_url}/api/puzzle/next`)
    const data = await response.json()

    // Add FEN to puzzle data
    res.send(addFen(data))
})

// Route for retrieving puzzle by id
puzzlesRouter.get('/puzzleID/:id', async (req,res) => {

    const id = req.params.id

    if (!id) {
        return res.status(400).json({ error: "Game with id not found" })
    }
    
    let game = await getGameById(id)

    if (!game) {
        return res.status(502).json()
    }

    res.send(game)
})

// Route for retrieving many puzzles
puzzlesRouter.get('/batch', async (req,res) => {

    console.log('QUERY HERE', req.query)

    //console.log('QUERY failed HERE', req.query.failed)

    let response

    if (req.query.failed === 'failed') {
        response = await getFailedBatch(1) // TODO: get id from server, not from frontend
        console.log('FAILED PUZZLES HERE', response)
        
    } else {
        response = await getFilteredBatch(req)
        console.log('RESULT HERE', response)
    }
    
    const data = response
    // Add FEN to each puzzle 
    for (const puzzle in data) {
        data[puzzle] = addFen(data[puzzle])
    }

    res.send(data)
})

// Function to add FEN and last move to puzzle data
const addFen = puzzleData => {
    const game = new Chess()

    game.loadPgn(puzzleData.game.pgn)
    const moves = game.history({ verbose: true })
    const puzzleGame = new Chess()
    for (const move of moves) {
        puzzleGame.move(move)
    }
    const lastPuzzleMove = moves[moves.length - 1]
    return {
        ...puzzleData,
        puzzle: {
            ...puzzleData.puzzle,
            fen: puzzleGame.fen(),
            lastMove:`${lastPuzzleMove.from}${lastPuzzleMove.to}`
        }
    }
}

export default puzzlesRouter