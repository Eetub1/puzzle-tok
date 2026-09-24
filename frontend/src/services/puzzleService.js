const backendURL = "http://localhost:3000" //TO DO: MOVE

const getDaily = async (response) => {
	response = await fetch(`${backendURL}/api/puzzles/daily`)
	console.log('daily puzzle !')
	const data = await response.json() 
	console.log('daily puzzle data:', data)
	return { // Return puzzle data for structure:
		fen : data.puzzle.fen,
		moves : data.puzzle.solution.join(" ") ,
		lastMove : data.puzzle.lastMove,
		rating : data.puzzle.rating,
		themes : data.puzzle.themes
	}
}

export {getDaily}