// Change wanted preference settings
const prefChange = async color => {
	const response = await fetch(`/api/user/preferences`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(color),
	})
	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Saving prefences failed: ${data.error}`)
	}

	return data
}

export {prefChange}