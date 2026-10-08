import { useState, useEffect } from "react"
import "./Matches.css"

import { getUserGames } from "../services/userService.js"

const GAMES_PER_SITE = 10

const Matches = () => {
	const [matches, setMatches] = useState([])

	// Fetch matches from the backend when the component mounts
	useEffect(() => {
		const fetchMatches = async () => {
			try {
				const games = await getUserGames(GAMES_PER_SITE)
				console.log("Fetched matches:", games)
				setMatches(games)
			} catch (error) {
				console.error("Error fetching matches:", error)
			}
		}
		fetchMatches()
	}, [])

	return (
		<div className="yourMatches">
			<h2>Your Matches</h2>
			<p>Amount of matches found: {matches.length}</p>
		</div>
	)
}

export default Matches