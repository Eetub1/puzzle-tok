import { useState } from 'react'
import ChessReels from './components/ChessReels';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	const [count, setCount] = useState(0)

	return (
		<ChessReels />
	)
}

export default App
