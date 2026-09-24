const backendURL = "http://localhost:3000"

const signup = async credentials => {
    const response = await fetch(`${backendURL}/api/login`, {
        method: "POST",
        body: JSON.stringify(credentials)
    })
    return response.data
}

export {
    signup
}