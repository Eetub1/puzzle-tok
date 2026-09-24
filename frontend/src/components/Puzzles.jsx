import { getDaily } from "../services/puzzleService"

const Puzzles = ({dailyPuzzle}) => {

	const handleDaily = async event => {
		event.preventDefault()
		const result = await getDaily()
		console.log('daily puzzle result:', result)
		dailyPuzzle(result) 
	}

	return (
		<div className="puzzleTest" >
			<p>Get a puzzle</p>
			<p>Check console to see the result</p>
			<button onClick={(e)=>handleDaily(e)}>Get daily puzzle </button>
		</div>
	)
}

export default Puzzles