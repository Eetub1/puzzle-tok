import { getToken } from "./authService"

const updateUserChessAccounts = async usernames => {
	const response = await fetch(`/api/user/chess-accounts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${getToken()}` },
		body: JSON.stringify({ usernames }),
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Update failed: ${data.error}`)
	}

	return data
}


const getUserProfile = async () => {
	const response = await fetch(`/api/user/profile`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${getToken()}` }
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Couldn't get profile: ${data.error}`)
	}

	return data
}

export {
	updateUserChessAccounts,
	getUserProfile
}