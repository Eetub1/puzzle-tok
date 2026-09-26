import express, { response, Router } from "express"
const puzzlesRouter = express.Router()
const base_url = `https://lichess.org`

// Retrieve a puzzle by id
const getGameById = async id => {

    console.log("Retrieving game by id")

    let response = await fetch(`${base_url}/api/puzzle/${id}`)

    if (!response.ok) {
		throw new Error(`Lichess request failed: ${response.status}`)
	}

    console.log("puzzle", response)

    return response.json()
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
    console.log(req)
    console.log('Token:', req.cookies.Token)
    console.log('Body: ',req.body)

    let response = await fetch(`${base_url}/api/puzzle/next`,{   
    headers: {
        Authorization: `Bearer ${req.cookies.Token}`
    }
    });

    res.send(await response.json())
})


// Route for retrieving puzzle by id
puzzlesRouter.get('/puzzleID/:id', async (req,res) => {

    console.log("params: ", req.params.id)
    const id = req.params.id
    console.log("Sending next by id")

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

    const query = new URLSearchParams({ //TODO: add possibility to filter
        "difficulty": "normal",
        "nb": 5,
        "color": "white"
	})

    console.log("Sending multiple puzzles")
    console.log('Token:', req.cookies.Token)
    console.log('Body: ',req.body)

    let response = await fetch(`${base_url}/api/puzzle/batch/mix?${query}`,{   //TODO: In the future possibility to filter with theme/opening
    headers: {
        Authorization: `Bearer ${req.cookies.Token}`
    }
    });

    if (!response.ok) {
		throw new Error(`Lichess request failed: ${response.status}`)
	}

    res.send(await response.json())
})

export default puzzlesRouter