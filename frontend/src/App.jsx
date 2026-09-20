import { useState } from 'react'
import { ChessBoard } from './components/ChessBoard.jsx'

function App() {
	const [count, setCount] = useState(0)

	return (
		<div>
			<ChessBoard/>
		</div>
	)
}

export default App
