//const backendURL = ''

const getAccessToken = async (response) => {
	response = await fetch(`/api/auth/getAuth`)
	console.log('auth result', response)
	return response.json()
}

export {getAccessToken}