const backendURL = "http://localhost:3000"

const signup = async credentials => {
    const response = await fetch(`${backendURL}/api/auth/signup`, {
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
    const response = await fetch(`${backendURL}/api/auth/login`, {
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
}

export {
    signup,
    login,
    logout
}