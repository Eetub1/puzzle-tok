const backendURL = "http://localhost:3000" // TODO: move this

const getAccessToken = async (response) => {
    response = await fetch(`${backendURL}/api/auth/getAuth`)
    return response.json()
    
}

export {getAccessToken}