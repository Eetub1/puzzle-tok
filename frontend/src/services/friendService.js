import { getToken } from "./authService"

const searchUsers = async query => {
	const response = await fetch(`/api/friends/search?query=${encodeURIComponent(query)}`, {
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

// Addressee means to whom the friend invitation is sent to
const sendFriendRequest = async addressee => {
	const response = await fetch(`/api/friends/invitation`, {
		method: "POST",
		body: JSON.stringify({ addressee }),
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${getToken()}` }
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Couldn't send friend request: ${data.error}`)
	}
	return data
}

export {
	searchUsers,
	sendFriendRequest
}