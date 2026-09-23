import { Chess } from 'chess.js'
import GetUserGames from './components/GetUserGames'
import { PuzzleBoard } from './components/chessboard/PuzzleBoard.jsx'
import { ChessBoard } from './components/chessboard/ChessBoard.jsx'

function App() {

	const puzzle = {
		puzzle_id: "0009B",
    	fen: "r2qr1k1/b1p2ppp/pp4n1/P1P1p3/4P1n1/B2P2Pb/3NBP1P/RN1QR1K1 b - - 1 16",
    	moves: "b6c5 e2g4 h3g4 d1g4",
    	rating: 1112,
    	themes: "advantage middlegame short"
	}
	
	return (
		<div>
			<GetUserGames/>
			<PuzzleBoard puzzle={puzzle} />
		</div>
	)
}

export default App
