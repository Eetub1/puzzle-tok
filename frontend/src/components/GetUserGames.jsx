import { useState } from "react"
import { getUserGames } from "../services/gameService"

const GetUserGames = () => {
	const [chessComUsername, setChessComUsername] = useState("")
	const [lichessUsername, setLichessUsername] = useState("")

	const handleSubmit = async event => {
		event.preventDefault()
		console.log({ lichessUsername, chessComUsername })

		const result = await getUserGames({"lichessUsername": lichessUsername, "chessComUsername": chessComUsername})
		console.log(result)

		setChessComUsername("")
		setLichessUsername("")
	}


	return (
		<div className="getUserGamesTestSection" >
			<p>Get usergames testsection (in the real app move this to a more logical place)</p>
			<p>Check console to see the result</p>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<label htmlFor="lichessUsername">Lichess username: </label>
						<input id="lichessUsername" type="text" onChange={(event) => setLichessUsername(event.target.value)} value={lichessUsername}/>
					</div>

					<div>
						<label htmlFor="chessComUsername">Chess.com username: </label>
						<input id="chessComUsername" type="text" onChange={(event) => setChessComUsername(event.target.value)} value={chessComUsername} />
					</div>
				</div>
				<button type="submit">get games</button>
			</form>
		</div>
	)
}

export default GetUserGames