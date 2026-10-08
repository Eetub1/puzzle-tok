const parsePGN = pgn => {
    console.log("TODO")
}


// TODO: parse pgn
const normalizeLichessGame = game => ({
    id: game.id,
    source: "lichess",
    url: `https://lichess.org/${game.id}`,
    pgn: game.pgn,
    white: game.players.white.user?.name ?? "Computer",
    black: game.players.black.user?.name ?? "Computer",
    result: game.winner ?? "draw",
    timeClass: game.speed,
    playedAt: game.lastMoveAt, // milliseconds
})


const getChessComResult = game => {
    if (game.white.result === "win") return "white"
    if (game.black.result === "win") return "black"
    return "draw"
}

// TODO: parse pgn
const normalizeChessComGame = game => ({
    id: game.uuid,
    source: "chesscom",
    url: game.url,
    pgn: game.pgn,
    white: game.white.username,
    black: game.black.username,
    result: getChessComResult(game),
    timeClass: game.time_class,
    playedAt: game.end_time * 1000, // Chess.com uses seconds, convert to milliseconds
})


const getLichessGames = async (username, limit) => {
    const query = new URLSearchParams({
		max: limit,
		clocks: true, // info about game clocks
		rated: true,
		pgnInJson: true, // contains portable game notation of the game
	})

	const url = `https://lichess.org/api/games/user/${encodeURIComponent(username)}?${query}`

	const response = await fetch(url, {
		headers: { Accept: "application/x-ndjson" }, // one JSON object per line
	})

    if (!response.ok) {
		throw new Error(`Lichess request failed: ${response.status}`)
	}

    const text = await response.text()

    // Split result, remove empty lines
    const games = text
		.split("\n")
		.filter(line => line.trim() !== "")
        .map(line => JSON.parse(line)) // parse line into javascript object
        .map(normalizeLichessGame) // normalize the game object to a more useful format
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
    const gamesUrl = `https://api.chess.com/pub/player/${username}/`.concat("games/", lastMonth.split("/games/")[1])

    const response = await fetch(gamesUrl)

    if (!response.ok) {
		throw new Error(`Chess.com games request failed: ${response.status}`)
	}
    
    const data = await response.json()

    console.log(data.games)
    return data.games.slice(0, limit).map(normalizeChessComGame)
}

export { getLichessGames, getChessComGames }