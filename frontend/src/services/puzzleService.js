const getDaily = async (response) => {
	response = await fetch(`/api/puzzles/daily`)
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

const getNextPuzzle = async (response) => {
	response = await fetch(`/api/puzzles/next`)  //TODO: make move, no fen in data
	const data = await response.json()
	return data
}

const getBatch = async (response) => {
	response = await fetch(`/api/puzzles/batch`)
	const data = await response.json()
	return data
}

const getPuzzleById = async (response) => {
	response = await fetch(`/api/puzzles/puzzlebyid`)
	const data = await response.json()
	console.log('here data: ', data)
	return { // Return puzzle data for structure:
		fen : data.puzzle.fen,
		moves : data.puzzle.solution.join(" ") ,
		rating : data.puzzle.rating,
		themes : data.puzzle.themes
	}
}

export {getNextPuzzle, getDaily, getBatch, getPuzzleById}