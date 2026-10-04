import { useState } from "react"
import { prefChange } from "../services/preferenceService"

const Preferences = ({user_id}) => {
	const [color, setColor] = useState("both")

	const handleSubmit = async event => {
		event.preventDefault()

		console.log('here user id',user_id)

		try {
			const data = await prefChange({ color, user_id })
			console.log(data)
		} catch (error) {
			console.log("Error with setting preferences: ", error)
		}
	}

	return (
		<div className="filter">
			<form onSubmit={handleSubmit}>
				<label>Color: </label>
				<select name="color_selection" id="colors"
					value={color} onChange={(event) => setColor(event.target.value)}>
					<option value="black">Black</option>
					<option value="white">White</option>
					<option value="both">Both</option>
				</select>
				<br></br>
				<input type="submit" value="Submit"></input>
			</form>
			<p>current color: {color}</p>
		</div>
	)
}

export default Preferences