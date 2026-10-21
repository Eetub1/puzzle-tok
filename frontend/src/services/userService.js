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


const getUserGames = async (limit = 10) => {
	const response = await fetch(`/api/user/games?limit=${limit}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${getToken()}` }
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Couldn't get user games: ${data.error}`)
	}

	return data
}

const getStreak = async () => {
    const response = await fetch(`/api/user/streak`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getToken()}` }
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Couldn't get streak: ${data.error}`)
    }

    return data.streak
}


const resendEmailVerification = async () => {
	const response = await fetch("/api/user/resend-verification", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${getToken()}` }
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Email resend failed: ${data.error}`)
	}

	return data
}


export {
	updateUserChessAccounts,
	getUserProfile,
	getUserGames,
	getStreak,
	resendEmailVerification
}