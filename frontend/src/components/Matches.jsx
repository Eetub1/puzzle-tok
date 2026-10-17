import { useState, useEffect } from "react"
import "./Matches.css"
import { Card } from "react-bootstrap"
import { getUserGames } from "../services/userService.js"
import { getUserProfile } from "../services/userService.js"

const GAMES_PER_SITE = 10

const Matches = ({ setMessage }) => {
	const [profile, setProfile] = useState(null) // Contains username, lichess and chess.com usernames and email if it has been verified
	const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem("userGames")) ?? [])
	const [filter, setFilter] = useState("all")

	// Fetch matches from the backend when the component mounts
	useEffect(() => {
		if (matches.length > 0) {
			return // If matches are already in state, no need to fetch again
		}

		const fetchMatches = async () => {
			try {
				const games = await getUserGames(GAMES_PER_SITE)
				localStorage.setItem("userGames", JSON.stringify(games)) // Store the fetched games in local storage
				// console.log("Fetched matches:", games)
				setMatches(games)
			} catch (error) {
				// console.error("Error fetching matches:", error)
				setMessage({ message: "Failed to fetch matches: " + error.message, isError: true })
				setTimeout(() => {
					setMessage(null)
				}, 4000)
			}
		}
		fetchMatches()
	}, [matches.length, setMessage])


	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getUserProfile()
				// console.log(data)
				setProfile(data)
			} catch (error) {
				console.error("Failed to fetch user profile:", error)
			}
		}
		fetchData()
	}, [])


	const filterMatches = matches => {
		switch (filter) {
			case "all":
				return matches
			case "rapid":
				return matches.filter(match => match.timeClass === "rapid")
			case "blitz":
				return matches.filter(match => match.timeClass === "blitz")
			case "bullet":
				return matches.filter(match => match.timeClass === "bullet")
			case "lichess":
				return matches.filter(match => match.source === "lichess")
			case "chesscom":
				return matches.filter(match => match.source === "chesscom")
			default:
				return matches
		}
	}


	const processMatches = (matches) => {
		if (matches.length === 0 || !profile) return []

		matches = filterMatches(matches)

		return matches.map((match) => {
			let outcome
			let ownSide
			let opponent

			if (match.source === "lichess") {
				if (profile.lichess.toLowerCase() === match.white.toLowerCase()) {
					ownSide = "white"
					opponent = match.black
				} else {
					ownSide = "black"
					opponent = match.white
				}
			} else { // match played on chess.com
				if (profile.chessCom.toLowerCase() === match.white.toLowerCase()) {
					ownSide = "white"
					opponent = match.black
				} else {
					ownSide = "black"
					opponent = match.white
				}
			}

			if (match.result === "draw") {
				outcome = "draw"
			} else if (match.result !== ownSide) {
				outcome = "loss"
			} else {
				outcome = "win"
			}

			// Figure out if match was played today, yesterday, or some other day
			let played = new Date(match.playedAt)
			const today = new Date()
			const playedToday = played.toDateString() === today.toDateString()
			const playedYesterday = played.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()
			played = played.toLocaleDateString("fi-FI") // the date of the game
			return {...match, outcome, opponent, ownSide, playedToday, playedYesterday, played}
		})
	}
	const processedMatches = processMatches(matches) // filters based on selected filter and adds additional fields to the data
	// console.log(processedMatches)


	return (
		<div className="your-matches">
			<div id="matches-header">
				<h2>Your Recent Matches</h2>
				<p>{processedMatches.length} games</p>
				{profile && !profile.lichess && !profile.chessCom && <p>To fetch matches, please add your Lichess or Chess.com username in your profile.</p>}
			</div>

			<div id="matches-section">
				<div id="filter-options">
					<button className="btn" onClick={() => setFilter("all")}>All</button>
					<button className="btn" onClick={() => setFilter("rapid")}>Rapid</button>
					<button className="btn" onClick={() => setFilter("blitz")}>Blitz</button>
					<button className="btn" onClick={() => setFilter("bullet")}>Bullet</button>
					<button className="btn" onClick={() => setFilter("lichess")}>Lichess</button>
					<button className="btn" onClick={() => setFilter("chesscom")}>Chess.com</button>
				</div>
				{renderMatches(processedMatches)}
			</div>
		</div>
	)
}


const renderMatch = match => {
	const getGameOutcomeElement = outcome => {
		switch (outcome) {
			case "win":
				return <div className="badge bg-success text-white">W</div>
			case "loss":
				return <div className="badge bg-danger text-white">L</div>
			default:
				return <div className="badge bg-secondary text-white">D</div>
		}
	}

	return (
		<Card key={match.id} className="match-card">
			{getGameOutcomeElement(match.outcome)}
			<div className="match-info">
				<div>
					<div>
						<span>As {match.ownSide} | </span>
						<span>{match.timeClass} </span>
						<span>vs. {match.opponent}</span>
					</div>
					<span>On {match.source}</span>
				</div>
				<a href={match.url} target="_blank" rel="noopener noreferrer">link</a>
			</div>
		</Card>
	)
}


const renderMatches = matches => {
	let todayCount = 0
	let yesterdayCount = 0
	let otherCount = 0

	for (const match of matches) {
		if (match.playedToday) todayCount += 1
		if (match.playedYesterday) yesterdayCount += 1
		if (!match.playedToday && !match.playedYesterday) otherCount += 1
	}

	return (
		<div id="matches-container">
			{todayCount > 0 && (
				<div className="matches-group">
					<h4 className="card-date-title">Today</h4>
					{matches.filter(match => match.playedToday).map(match => (
						renderMatch(match)
					))}
				</div>
			)}

			{yesterdayCount > 0 && (
				<div className="matches-group">
					<h4 className="card-date-title">Yesterday</h4>
					{matches.filter(match => match.playedYesterday).map(match => (
						renderMatch(match)
					))}
				</div>
			)}

			{otherCount > 0 && (
				<div className="matches-group">
					<h4 className="card-date-title">Earlier</h4>
					{matches.filter(match => !match.playedToday && !match.playedYesterday).map(match => (
						renderMatch(match)
					))}
				</div>
			)}
		</div>
	)
}

export default Matches