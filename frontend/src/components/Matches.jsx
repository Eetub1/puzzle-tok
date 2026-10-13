import { useState, useEffect } from "react"
import "./Matches.css"

import { Card } from "react-bootstrap"

import { getUserGames } from "../services/userService.js"
import { getUserProfile } from "../services/userService.js"

const GAMES_PER_SITE = 10

const Matches = () => {
	const [profile, setProfile] = useState(null) // Contains username, lichess and chess.com usernames and email if it has been verified
	const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem("userGames")) ?? [])
	const [filter, setFilter] = useState("all")
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


	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getUserProfile()
				console.log(data)
				setProfile(data)
			} catch (error) {
				console.error("Failed to fetch user profile:", error)
			}
		}
		fetchData()
	}, [])


	const processMatches = (matches) => {
		if (matches.length === 0 || !profile) return []

		return matches.map((match) => {
			let outcome
			let yourSide
			let opponent

			if (match.source === "lichess") {
				if (profile.lichess.toLowerCase() === match.white.toLowerCase()) {
					yourSide = "white"
					opponent = match.black
				} else {
					yourSide = "black"
					opponent = match.white
				}
			} else { // match played on chess.com
				if (profile.chessCom.toLowerCase() === match.white.toLowerCase()) {
					yourSide = "white"
					opponent = match.black
				} else {
					yourSide = "black"
					opponent = match.white
				}
			}

			if (match.result === "draw") {
				outcome = "draw"
			} else if (match.result !== yourSide) {
				outcome = "loss"
			} else {
				outcome = "win"
			}
			return {...match, outcome, opponent}
		})
	}
	const processedMatches =processMatches(matches)


	const getGameOutcomeElement = (outcome) => {
		console.log(outcome)
		switch (outcome) {
			case "win":
				return <div className="badge bg-success text-white">W</div>
			case "loss":
				return <div className="badge bg-danger text-white">L</div>
			default:
				return <div className="badge bg-secondary text-white">D</div>
		}
	}

	// filter matches based on the selected filter here

	console.log("Profile:", profile)

	return (
		<div className="your-matches">
			<div id="matches-header">
				<h2>Your Matches</h2>
				<p>{matches.length} recent games</p>
				{profile && !profile.lichess && !profile.chessCom && <p>To fetch matches, please add your Lichess or Chess.com username in your profile.</p>}
			</div>

			<div id="matches-section">
				<div id="filter-options">
					<button className="btn btn-link" onClick={() => setFilter("all")}>All</button>
					<button className="btn btn-link" onClick={() => setFilter("rapid")}>Rapid</button>
					<button className="btn btn-link" onClick={() => setFilter("blitz")}>Blitz</button>
					<button className="btn btn-link" onClick={() => setFilter("lichess")}>Lichess</button>
					<button className="btn btn-link" onClick={() => setFilter("chessCom")}>Chess.com</button>
				</div>
				<div id="matches-container">
					{processedMatches.map((match) => (
						<Card key={match.id} className="match-card">
							{getGameOutcomeElement(match.outcome)}
							<div className="match-info">
								<div>
									<span>{match.timeClass} </span>
									<span>vs. {match.opponent}</span>
								</div>

								<a href={match.url} target="_blank" rel="noopener noreferrer">link</a>
							</div>

							{/*still need date, which color you were playing, and platform */}
							{/**<p>{new Date(match.playedAt).toLocaleString("fi-FI")}</p> */}
						</Card>
					))}
				</div>
			</div>
		</div>
	)
}

export default Matches