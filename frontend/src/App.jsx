import GetUserGames from './components/GetUserGames'
import { ChessBoard } from './components/ChessBoard.jsx'
import Puzzles from './components/Puzzles.jsx'

function App() {
	return (
		<div>
			<GetUserGames/>
			<Puzzles/>
			<ChessBoard/>
		</div>
	)
}

export default App
