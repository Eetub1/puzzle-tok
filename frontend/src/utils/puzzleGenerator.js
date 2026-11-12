import { Chess } from "chess.js"

// Skip boring opening theory
const SKIP_FIRST_MOVES = 10

const generatePuzzles = matches => {
	const candidates = [] // these could be potential puzzles

	for (const match of matches) {
		const game = new Chess()

		try {
			game.loadPgn(match.pgn)
			console.log(`Loaded PGN for game ${match.id} from ${match.source}`)
		} catch (error) {
			console.error(`Couldn't parse the PGN of game ${match.id}:`, error)
			continue
		}

		// only want to generate puzzles from the moves that the user made
		const userColor = match.ownSide === "white" ? "w" : "b"
		const moves = game.history({ verbose: true }) // array containing detailed description of every move

		// The idea is to treat every move after SKIP_FIRST_MOVES as a possible puzzle position
		moves.forEach((move, moveCount) => {
			if (moveCount < SKIP_FIRST_MOVES || move.color !== userColor) {
				return
			}

			// The position before the user's move is where a puzzle could start
			candidates.push({
				gameId: match.id,
				source: match.source,
				moveCount,                                   // how many half moves have been played so far
				fen: move.before,                            // state of the board before the user's move
				lastMove: moves[moveCount - 1]?.lan ?? null, // the opponent's move that led to this position
				playedMove: move.lan,                        // what the user actually played in the position, useful for showing what went wrong
			})
		})
	}

	// test that stockfish is working
	const worker = new Worker("/stockfish-19-lite-single.js")
	worker.onmessage = event => console.log(event.data)
	worker.postMessage("uci")


	console.log(`${candidates.length} candidate positions found`)
	return candidates
}

export { generatePuzzles }