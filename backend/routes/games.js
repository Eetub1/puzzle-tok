import express from "express"
const gamesRouter = express.Router()


const getLichessGames = async username => {
    const query = new URLSearchParams({
		max: 5, // set this to a low value because the query can be slow
		clocks: true, // info about game clocks
		rated: true,
		pgnInJson: true, // contains portable game notation of the game
	})

    // Name can contain special symbols, needs to be encoded
	const url = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?${query}`

	const response = await fetch(url, {
		headers: { Accept: "application/x-ndjson" }, // With this header, the API gives a single JSON object per line
	})

    if (!response.ok) {
		throw new Error(`Lichess request failed: ${response.status}`)
	}

    // Need to use a different method if max is a larger number
    const text = await response.text()

    // Split result, remove empty lines
    const games = text
		.split("\n")
		.filter(line => line.trim() !== "")
    return games
}


const getChessComGames = async username => {
    return "TODO getChessComGames"
}


gamesRouter.get("/", async (req, res) => {
    // Can unpack other websites here if or when we add support to other sites
    const { chessCom, lichess} = req.query

    if (!chessCom && !lichess) {
        return res.status(400).json({ error: "At least one username is required" })
    }

    const resultObject = {}

    try {
        const lichessGames = await getLichessGames(lichess)
        resultObject.lichess = lichessGames
    } catch (error) {
		res.status(502).json({ error: error.message })
	}

    try {
        const chessComGames = await getChessComGames(chessCom)
        resultObject.chessCom = chessComGames
    } catch (error) {
		res.status(502).json({ error: error.message })
	}

    return res.json(resultObject)
})


export default gamesRouter