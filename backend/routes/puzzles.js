import express, { response, Router } from "express"
const puzzlesRouter = express.Router()
const base_url = `https://lichess.org`

puzzlesRouter.get('/daily', async (req,res) => {

    console.log("Sending daily puzzle")

    let response = await fetch(`${base_url}/api/puzzle/daily`)
    res.send(await response.json())
})

puzzlesRouter.get('/puzzle/next', async (req,res) => {

    console.log("Sending next puzzle")
    console.log(req.cookies)
    let response = fetch(`${base_url}/api/puzzle/next`,{   
    headers: {
        Authorization: `Bearer ${req.cookies['Token']}`
    }
    });

    res.send(await response.json())
})

export default puzzlesRouter