import { getDaily } from "../services/puzzleService"

const Puzzles = ({dailyPuzzle}) => {

	//const [token, setToken] = useState("")

	/*
	const handleClick = async event => {
		event.preventDefault()
		const result = await getAccessToken()
		setToken(result)
		getPuzzle(token)

		setToken("")
	}*/

	const handleDaily = async event => {
		event.preventDefault()
		const result = await getDaily()
		console.log('daily puzzle result:', result)
		dailyPuzzle(result) 
	}
	const handleClick = async event => {
		event.preventDefault()
		const result = getDaily()
		console.log('hello')
		console.log(result)
	}

	return (
		<div className="puzzleTest" >
			<p>Get a puzzle</p>
			<p>Check console to see the result</p>
			<button onClick={(e)=>handleDaily(e)}>Get daily puzzle </button>
			<button onClick={handleClick}> </button>
		</div>
	)
}

export default Puzzles
