import express, { response, Router } from "express"
const puzzlesRouter = express.Router()
const base_url = `https://lichess.org`


const getGameById = async id => {

    console.log("Retrieving game by id")

    let response = await fetch(`${base_url}/api/puzzle/${id}`)

    if (!response.ok) {
		throw new Error(`Lichess request failed: ${response.status}`)
	}

    console.log("puzzle", response)

    /*
    // Need to use a different method if max is a larger number
    const text = await response.text()
    // Split result, remove empty lines
    const game = text
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => JSON.parse(line)) // parse line into javascript object

    console.log('game: ', game)*/

    return response.json()
}


puzzlesRouter.get('/daily', async (req,res) => {

    console.log("Sending daily puzzle")

    let response = await fetch(`${base_url}/api/puzzle/daily`)
    res.send(await response.json())
})

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



puzzlesRouter.get('/puzzlebyid', async (req,res) => {

    let id = 'y14HH'
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

puzzlesRouter.get('/daily', async (req,res) => {

    console.log("Sending daily puzzle")

    let response = await fetch(`${base_url}/api/puzzle/daily`)
    res.send(await response.json())
})

export default puzzlesRouter