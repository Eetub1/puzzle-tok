// Change wanted preference settings
const prefChange = async preferences => {

	console.log('user id is service',preferences.user_id)
	console.log('color is service', preferences.color)

	const response = await fetch(`/api/user/preferences`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(preferences),
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Saving prefences failed: ${data.error}`)
	}

	return data
}

export {prefChange}