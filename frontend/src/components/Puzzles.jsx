import { getDaily, getNextPuzzle } from "../services/puzzleService"

const Puzzles = ({setPuzzle}) => {


	const handleNext = async event => {
		event.preventDefault()

		const result = await getNextPuzzle()
		console.log('next result:', result)
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
		</div>
	)
}

export default Puzzles
