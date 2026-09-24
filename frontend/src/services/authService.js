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

export {
    signup
}