const getLichessGames = async (username, limit) => {
    const query = new URLSearchParams({
		max: limit,
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

        // Right now this is pointless, but in the future we might want to do some processing here
        .map(line => JSON.parse(line)) // parse line into javascript object
    return games
}


const getChessComActiveMonths = async username => {
    const url = `https://api.chess.com/pub/player/${username}/games/archives`
    const response = await fetch(url)

    if (!response.ok) {
		throw new Error(`Chess.com months request failed: ${response.status}`)
	}

    const { archives } = await response.json()
    return archives
}


const getChessComGames = async (username, limit) => {
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

export { getLichessGames, getChessComGames }