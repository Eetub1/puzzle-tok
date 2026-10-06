import { prefChange} from "../services/preferenceService"

const Preferences = ({user_id, difficulty, color, setDifficulty, setColor}) => {

	const handleSubmit = async event => {
		event.preventDefault()

		try {
			const data = await prefChange({ color, difficulty,user_id })
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
				<label>Difficulty: </label>
				<select name="difficulty_selection" id="difficulties"
					value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
					<option value="easiest">Easiest</option>
					<option value="easier">Easier</option>
					<option value="normal">Normal</option>
					<option value="harder">Harder</option>
					<option value="hardest">Hardest</option>
				</select>
				<br></br>
				<input type="submit" value="Submit"></input>
			</form>
			<p>current color: {color}</p>
			<p>current difficulty: {difficulty}</p>
		</div>
	)
}

export default Preferences