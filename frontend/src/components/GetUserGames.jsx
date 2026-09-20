import { useState } from "react"

const GetUserGames = () => {
	const [chessComUsername, setChessComUsername] = useState("")
	const [lichessUsername, setLichessUsername] = useState("")

	const handleSubmit = () => {
        
	}

	return (
		<div className="getUserGamesTestSection" >
			<p>Get usergames testsection (in the real app move this to a more logical place)</p>
			<form action="">
				<div>
					<div>
						<label htmlFor="chessComUsername">Lichess username: </label>
						<input id="chessComUsername" type="text" />
					</div>

					<div>
						<label htmlFor="lichessUsername">Chess.com username: </label>
						<input id="lichessUsername" type="text" />
					</div>
				</div>
				<button onClick={handleSubmit}>get games</button>
			</form>
		</div>
	)
}

export default GetUserGames