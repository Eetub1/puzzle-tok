import { useState } from 'react'
import GetUserGames from './components/GetUserGames'

function App() {
	const [count, setCount] = useState(0)

	return (
		<div>
			<p>Hieno projekti tähän</p>
			<GetUserGames/>
		</div>
	)
}

export default App
