
// TODO: move this logic to backend!
/*const getLichessGames = async username => {

	const query = {
		max: 5, // how many games are fetched at most
		clocks: true,
		rated: true,
		pgnInJson: true
	}
	const url = `https://lichess.org/api/games/user/${username}/${query}`

	const response = await fetch(url, {
		headers: { Accept: "application/x-ndjson" }, // With this header, the API gives a single JSON object per line
	})

	if (response.ok) return response.body
}

const getChessComGames = username => {

}*/

const backendURL = "http://localhost:3000"

// Usernames is an object that can contain many usernames
const getUserGames = async usernames => {
	const query = new URLSearchParams(usernames)
	const response = await fetch(`${backendURL}/api/games?${query}`)
	return response.json()
}

export { getUserGames }