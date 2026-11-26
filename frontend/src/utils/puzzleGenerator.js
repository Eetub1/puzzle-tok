import { Chess } from "chess.js"

// Skip boring opening theory
const SKIP_FIRST_MOVES = 10


// moves that are evaluated as mate need to be converted to centipawns
const toCentipawns = result => {
	if (result.scoreType === "mate") {
		return result.score > 0 ? 10000 : -10000
	}
	return result.score
}


const generatePuzzles = async matches => {
	const candidates = findCandidates(matches)
	console.log(`${candidates.length} candidate positions found`)

	const engine = createEngine()

	// A puzzle starts before your move. Its a situation where there is only a single clear best move
	// that gives you a winning advantage in the position. Therefore we need to compare the best
	// and second best moves for you in the position to make sure this is the case.

	const puzzles = []
	for (const candidate of candidates) {
		const [best, secondBest] = await engine.evaluate(candidate.fen)
		console.log("Best:", best, "Second best:", secondBest)

		if (!secondBest) {
			continue // only one legal move
		}

		if (best.move === candidate.playedMove) {
			continue // you played the best move, so this is not a puzzle
		}

		// these boundaries can be tweaked
		if (toCentipawns(best) > 150 && toCentipawns(secondBest) < 50) {
			puzzles.push({ ...candidate, bestMove: best.move })
		}
	}
	engine.terminate() // shut down the whole engine

	console.log(`${puzzles.length} puzzles found`)

	return puzzles
}


const createEngine = () => {
	const engine = new Worker("/stockfish-19-lite-single.js")
	engine.postMessage("uci")
	engine.postMessage("setoption name MultiPV value 2") // report the 2 best moves

	let results = []    // contains the best and second best moves for the current position
	let whenDone = null // function to call when the engine has finished


	// Takes one line of engine output and picks out the parts we need.
	// Example: info depth 14 multipv 1 score cp 132 nodes 1200 pv e2e4 e7e5
	const readInfoLine = line => {
		const words = line.split(" ")

		const multipvIndex = words.indexOf("multipv")
		const scoreIndex = words.indexOf("score")
		const pvIndex = words.indexOf("pv")

		return {
			rank: Number(words[multipvIndex + 1]),   // 1 = best move, 2 = second best
			scoreType: words[scoreIndex + 1],        // "cp" or "mate"
			score: Number(words[scoreIndex + 2]),    // for example 132
			move: words[pvIndex + 1],                // for example "e2e4"
		}
	}


	// This runs every time the engine sends a line
	engine.onmessage = event => {
		const line = event.data

		// Lines with " pv " contain an evaluation. Lines with "bound" are unfinished guesses and we don't need them
		if (line.startsWith("info") && line.includes(" pv ") && !line.includes("bound")) {
			const info = readInfoLine(line)
			results[info.rank - 1] = info
		}

		// The search is done for this position, end search and return results
		if (line.startsWith("bestmove")) {
			whenDone(results)
		}
	}


	const evaluate = (fen, depth = 12) => {
		return new Promise(resolve => {
			results = [] // remember to clear this when starting an evaluation
			whenDone = resolve // When the engine is done, call this function with the results

			// Start the search
			engine.postMessage("position fen " + fen)
			engine.postMessage(`go depth ${depth}`)
		})
	}


	const terminate = () => {
		engine.terminate()
	}

	return { evaluate, terminate }
}


const findCandidates = matches => {
	const candidates = []

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

			candidates.push({
				gameId: match.id,
				source: match.source,
				moveCount,                                   // how many half moves have been played so far
				fen: move.before,                            // state of the board before the user's move
				lastMove: moves[moveCount - 1]?.lan ?? null, // the opponent's move that led to this position
				playedMove: move.lan,                        // what you actually played in the position, useful for showing what went wrong
			})
		})
	}

	return candidates
}


export { generatePuzzles }