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
	response = await fetch(`/api/puzzles/next`)  
	const data = await response.json()
	return { // Return puzzle data for structure:
		fen : data.puzzle.fen,
		moves : data.puzzle.solution.join(" ") ,
		lastMove : data.puzzle.lastMove,
		rating : data.puzzle.rating,
		themes : data.puzzle.themes
	}
}

const getBatch = async (response) => {
	response = await fetch(`/api/puzzles/batch`)
	const data = await response.json()
	console.log('batch data:', data)
	return data.puzzles.map(puzzles => ({ // Return puzzle data for structure:
        fen: puzzles.puzzle.fen,
        moves: puzzles.puzzle.solution.join(' '),
        lastMove: puzzles.puzzle.lastMove,
        rating: puzzles.puzzle.rating,
        themes: puzzles.puzzle.themes
	}))
}

const getPuzzleById = async id => {
	let response = await fetch(`/api/puzzles/puzzleID/${id}`)
	const data = await response.json()
	console.log('here data: ', data)
	return { // Return puzzle data for structure:
		fen : data.puzzle.fen,
		moves : data.puzzle.solution.join(" ") ,
		lastMove : data.puzzle.lastMove,
		rating : data.puzzle.rating,
		themes : data.puzzle.themes
	}
}

export {getNextPuzzle, getDaily, getBatch, getPuzzleById}