import { useState, useEffect } from "react"
import "./Matches.css"

import { getUserGames } from "../services/userService.js"

const GAMES_PER_SITE = 10

const Matches = () => {
	const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem("userGames")) ?? [])
	console.log(matches)

	// Fetch matches from the backend when the component mounts
	useEffect(() => {
		if (matches.length > 0) {
			return // If matches are already in state, no need to fetch again
		}

		const fetchMatches = async () => {
			try {
				const games = await getUserGames(GAMES_PER_SITE)
				localStorage.setItem("userGames", JSON.stringify(games)) // Store the fetched games in local storage
				console.log("Fetched matches:", games)
				setMatches(games)
			} catch (error) {
				console.error("Error fetching matches:", error)
			}
		}
		fetchMatches()
	}, [matches.length])

	matches.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt)) // Sort matches in descending order by date

	return (
		<div className="yourMatches">
			<h2>Your Matches</h2>
			<p>Amount of matches found: {matches.length}</p>
			<div>
				{matches.map((match) => (
					<div key={match.id} className="match">
						<p>Match ID: {match.id}</p>
						<p>Played: {new Date(match.playedAt).toLocaleString("fi-FI")}</p>
						<p>TimeClass: {match.timeClass}</p>
						<p>White: {match.white}</p>
						<p>Black: {match.black}</p>
						<p>URL: <a href={match.url} target="_blank" rel="noopener noreferrer">View Game</a></p>
					</div>
				))}
			</div>
		</div>
	)
}

export default Matches