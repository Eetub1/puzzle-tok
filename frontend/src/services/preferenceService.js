// Change wanted preference settings
const prefChange = async preferences => {

	//console.log('user id is service',preferences.user_id)
	//console.log('color is service', preferences.color)
	//console.log('difficulty is service', preferences.difficulty)

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

const getInitialPreferences = async (response) => {
	response = await fetch(`/api/user/preferences`)
	if (!response.ok) {
		throw new Error("Failed to fetch preferences")
	}
	const json = await response.json()
	console.log("jason:", json)
	const data = JSON.parse(json)
	console.log('service data: ',data, data["color"])
	return {
		color : data.color,
		difficulty : data.difficulty
	}
}

export {prefChange, getInitialPreferences}