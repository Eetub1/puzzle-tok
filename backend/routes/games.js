import express, { json } from "express"
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

    // Apparently need to use a different method if max is a larger number
    const text = await response.text()

    // Split result, remove empty lines
    const games = text
		.split("\n")
		.filter(line => line.trim() !== "")
        .map(line => JSON.parse(line)) // parse line into javascript object
    return games
}


const getChessComActiveMonths = async username => {
    const url = `https://api.chess.com/pub/player/${username}/games/archives`
    const response = await fetch(url)

    // The response is an object of the following format:
    /*  {"archives": [
            "https://api.chess.com/pub/player/hikaru/games/2014/01",
            "https://api.chess.com/pub/player/hikaru/games/2014/02",
            "...",
            "https://api.chess.com/pub/player/hikaru/games/2026/09"
        ]}*/

    if (!response.ok) {
		throw new Error(`Chess.com months request failed: ${response.status}`)
	}

    const { archives } = await response.json()
    return archives
}


const getChessComGames = async username => {
    // The chess.com API works a bit differently than the lichess one
    // First we need to retrieve what months the user has games on chess.com
    const archives = await getChessComActiveMonths(username)
    const lastMonth = archives[archives.length - 1] // https://api.chess.com/pub/player/{username}/games/{VVVV}/{KK}

    const firstPart = `https://api.chess.com/pub/player/${username}/`
    const secondPart = lastMonth.split("/games/")[1] // string is of the form: {VVVV}/{KK}
    const gamesUrl = firstPart.concat("games/", secondPart)

    const response = await fetch(gamesUrl)

    if (!response.ok) {
		throw new Error(`Chess.com games request failed: ${response.status}`)
	}
    
    return await response.json()
}


gamesRouter.get("/", async (req, res) => {
    const { chessComUsername, lichessUsername} = req.query // Can unpack other websites here if or when we add support to other sites

    if (!chessComUsername && !lichessUsername) {
        return res.status(400).json({ error: "At least one username is required" })
    }

    const resultObject = {}

    if (lichessUsername) {
        try {
            const lichessGames = await getLichessGames(lichessUsername)
            resultObject.lichessGames = lichessGames
        } catch (error) {
            res.status(502).json({ error: error.message })
        }
    }

    if (chessComUsername) {
        try {
            const chessComGames = await getChessComGames(chessComUsername)
            resultObject.chessComGames = chessComGames
        } catch (error) {
            res.status(502).json({ error: error.message })
        }
    }

    return res.json(resultObject)
})


export default gamesRouter