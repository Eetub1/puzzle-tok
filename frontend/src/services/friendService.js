import { getToken } from "./authService"

const getFriendMatches = async query => {
	const response = await fetch(`/api/friend/search?query=${query}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${getToken()}` }
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Couldn't find users based on query: ${data.error}`)
	}

	return data
}

export {
	getFriendMatches
}