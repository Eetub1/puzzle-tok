import { useState } from 'react'
import ChessReels from './components/ChessReels';
import 'bootstrap/dist/css/bootstrap.min.css';
import GetUserGames from './components/GetUserGames'
import { PuzzleBoard } from './components/chessboard/PuzzleBoard.jsx'
import { ChessBoard } from './components/chessboard/ChessBoard.jsx'
import Puzzles from './components/Puzzles.jsx'




function App() {
	const [puzzle, setPuzzle] = useState(null)

	

	return (
		<div>
			<ChessReels>
				<GetUserGames/>
				<Puzzles setPuzzle={setPuzzle} />
				{puzzle ? <PuzzleBoard puzzle={puzzle} /> : <ChessBoard/>}
			</ChessReels>		
			
		</div>
	)
}

export default App
