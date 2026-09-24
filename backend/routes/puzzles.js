import express, { response, Router } from "express"
const puzzlesRouter = express.Router()
const base_url = `https://lichess.org`

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

puzzlesRouter.get('/batch', async (req,res) => {

    console.log("Sending multiple puzzles")
    console.log('Token:', req.cookie['Token'])
    console.log('Body: ',req.body)

    let response = await fetch(`${base_url}/api/puzzle/batch/mix`,{   //TODO: In the future possibility to filter with theme/opening
    headers: {
        Authorization: `Bearer ${req.cookie['Token']}`
    }
    });

    res.send(await response.json())
})

puzzlesRouter.get('/daily', async (req,res) => {

    console.log("Sending daily puzzle")

    let response = await fetch(`${base_url}/api/puzzle/daily`)
    res.send(await response.json())
})

export default puzzlesRouter