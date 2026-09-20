import { useState } from "react"

const GetUserGames = () => {
	const [chessComUsername, setChessComUsername] = useState("")
	const [lichessUsername, setLichessUsername] = useState("")

	const handleSubmit = event => {
        event.preventDefault()
		console.log({ lichessUsername, chessComUsername })
	}

    // https://lichess.org/api/games/user/{käyttäjänimi}

	return (
		<div className="getUserGamesTestSection" >
			<p>Get usergames testsection (in the real app move this to a more logical place)</p>
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