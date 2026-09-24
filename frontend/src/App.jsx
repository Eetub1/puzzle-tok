import { useState } from 'react'
import GetUserGames from './components/GetUserGames'
import { PuzzleBoard } from './components/chessboard/PuzzleBoard.jsx'
import { ChessBoard } from './components/chessboard/ChessBoard.jsx'
import Puzzles from './components/Puzzles.jsx'



function App() {
	const [puzzle, setPuzzle] = useState(null)

	

	return (
		<div>
			<GetUserGames/>
			<Puzzles setPuzzle={setPuzzle} />
			{puzzle ? <PuzzleBoard puzzle={puzzle} /> : <ChessBoard/>}
		</div>
	)
}

export default App
