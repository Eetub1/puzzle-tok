const verifyEmail = async token => {
	const response = await fetch("/api/auth/verify-email", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token }),
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Verification failed: ${data.error}`)
	}

	return data
}


const signup = async credentials => {
	const response = await fetch(`/api/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Signup failed: ${data.error}`)
	}

	return data
}


const login = async credentials => {
	const response = await fetch(`/api/auth/login`, {
		method: "POST", // not GET, because we are creating a token in the backend
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Login failed: ${data.error}`)
	}

	localStorage.setItem("puzzleTokUser", JSON.stringify(data)) // LocalStorage data has to be text

	return data
}


const logout = () => {
	localStorage.removeItem("puzzleTokUser")
	localStorage.removeItem("userGames") // Clear user games from local storage on logout
}

// Gets the token generated on login from localStorage
const getToken = () => {
	const session = JSON.parse(localStorage.getItem("puzzleTokUser"))
	return session?.token ?? null
}


const getAccessToken = async (response) => {
	response = await fetch(`/api/oauth/getAuth`)
	console.log('auth result', response)
	return response.json()
}


const isTokenValid = (responseStatus) => {
	// 401 means that the user lacks valid credentials
	if (responseStatus === 401) {
		// create a new event that is then picked up in App.jsx useEffect so we can logout properly
		window.dispatchEvent(new Event("logoutEvent"))
		throw new Error("Your session has expired. Log in again.")
	}
}


export {
	signup,
	login,
	logout,
	getAccessToken,
	verifyEmail,
	getToken,
	isTokenValid
}