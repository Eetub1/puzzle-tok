import { useState } from "react"
import { getDaily, getNextPuzzle, getBatch, getPuzzleById} from "../services/puzzleService"

const Puzzles = ({setPuzzle}) => {
	const [puzzleId, setPuzzleId] = useState("")

	const handleNext = async event => {
		event.preventDefault()

		const result = await getNextPuzzle()
		console.log('next result:', result)
		//setPuzzle(result) 
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
		console.log('batch result:', result)
		//setPuzzle(result) 
	}

	const handleDaily = async event => {
		event.preventDefault()
		const result = await getDaily()
		console.log('daily puzzle result:', result)
		setPuzzle(result) 
	}

	return (
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
