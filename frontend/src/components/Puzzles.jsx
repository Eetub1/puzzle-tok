/*
import { useState, useEffect } from "react"
import { getDaily, getNextPuzzle, getBatch, getPuzzleById} from "../services/puzzleService"

const Puzzles = ({ setPuzzle, setBatch, puzzleQueue }) => {
	const [puzzleId, setPuzzleId] = useState("")

	// Fetch a batch of puzzles when the queue is empty
	useEffect(() => {
		if (puzzleQueue.length !== 0) {
			return
		}
		// Create AbortController to cancel fetch because strict mode calls useEffect twice in development
		const controller = new AbortController()
		const puzzleBatch = async () => {
			try {
				const result = await getBatch(controller.signal)
				// Only set batch if fetch was not aborted
				if (!controller.signal.aborted) {
					setBatch(result)
				}
			} catch (error) {
				if (error.name !== 'AbortError') { // Ignore abort errors
					console.error(error)
				}
			}
		}
		puzzleBatch()
		return () => {
			controller.abort() // Abort fetch if new batch is requested
		}
	}, [puzzleQueue.length, setBatch])

	const handleNext = async event => {
		event.preventDefault()

		const result = await getNextPuzzle()
		console.log('next result:', result)
		setPuzzle(result)
	}

	const handlePuzzleById = async event => {
		event.preventDefault()

		const result = await getPuzzleById(puzzleId)
		console.log(result)

		setPuzzle(result)

		setPuzzleId("")
	}


	const handleBatch = async event => {
		event.preventDefault()
		const result = await getBatch()
		setBatch(result)
	}


	const handleDaily = async event => {
		event.preventDefault()
		const result = await getDaily()
		console.log('daily puzzle result:', result)
		setPuzzle(result)
	}

	return (
		null

		<div className="puzzleTest" >
			<p>Get a puzzle</p>
			<p>Check console to see the result</p>
			<a href="/api/auth/getAuth">login</a>
			<button onClick={(e)=>handleDaily(e)}>Get daily puzzle </button>
			<button onClick={(e)=>handleNext(e)}>Get next puzzle </button>
			<button onClick={(e)=>handleBatch(e)}>Get batch of puzzles </button>

			<form onSubmit={handlePuzzleById}>
				<div>
					<label htmlFor="puzzleId">Puzzle id: </label>
					<input id="puzzleId" type="text"
						onChange={(event) => setPuzzleId(event.target.value)}
						value={puzzleId}/>
				</div>
				<button type="submit">Get puzzle by id</button>
			</form>
		</div>

	)
}

export default Puzzles
*/