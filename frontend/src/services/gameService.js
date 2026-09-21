const backendURL = "http://localhost:3000"

// Usernames is an object that can contain many usernames
const getUserGames = async usernames => {
	const query = new URLSearchParams(usernames)
	const response = await fetch(`${backendURL}/api/games?${query}`)
	return response.json()
}

export { getUserGames }