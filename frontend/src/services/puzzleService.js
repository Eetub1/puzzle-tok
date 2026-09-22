const backendURL = "http://localhost:3000" //TO DO: MOVE

const getDaily = async (response) => {
	response = await fetch(`${backendURL}/api/puzzles/daily`)
	console.log('daily puzzle !')
	const data = await response.json() 
	console.log('daily puzzle data:', data)
	return { // Return puzzle data for structure:
		fen : data.puzzle.fen,
		moves : data.puzzle.solution.join(" ") ,
		rating : data.puzzle.rating,
		themes : data.puzzle.themes
	}
}

const getPuzzle = async () => {
	const response = await fetch(`${backendURL}/api/puzzle`)
	console.log('Hello')
	return response.json()
}

export {getPuzzle, getDaily}
