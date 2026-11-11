import { useState } from "react"
import { prefChange} from "../services/preferenceService"

const Preferences = ({user_id, difficulty, color, failed, theme, opening, setDifficulty, setColor, setFailed, setTheme, setOpening}) => {

	const [pressed, setPressed] = useState("None")

	const handleSubmit = async event => {
		event.preventDefault()

		try {
			const data = await prefChange({ color, difficulty, failed, theme, opening, user_id })
			console.log('pref jsx data!:', data)
		} catch (error) {
			console.log("Error with setting preferences: ", error)
		}
	}

	const handlePressed = async event => {
		setPressed(event.target.value)

		if (event.target.value === 'Theme') {
			setOpening('')
		} else if (event.target.value === 'Opening') {
			setTheme('')
		} else {
			setOpening('')
			setTheme('')
		}
	}

	const comp_map = {
		'Theme':
		<div>
			<label>Theme</label>
			<input id="themes-filter" value={theme} onChange={(event) => setTheme(event.target.value)}></input>
			<br></br>
		</div>,

		'Opening':
		<div>
			<label>Opening</label>
			<input id="openings-filter" value={opening} onChange={(event) => setOpening(event.target.value)}></input>
		</div>,

		'None':
		<></>
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
				<label>Failed: </label>
				<select name="failed_selection" id="failed"
					value={failed} onChange={(event) => setFailed(event.target.value)}>
					<option value="normal">Normal</option>
					<option value="failed">Failed</option>
				</select>
				<br></br>

				<div className="theme-opening">
					<div>
						<label>Theme</label>
						<input type="radio" name="theme-opening-bar" id="theme" value="Theme"
							onChange={handlePressed} />
					</div>

					<div>
						<label>Opening</label>
						<input type="radio" name="theme-opening-bar" id="opening" value="Opening"
							onChange={handlePressed}/>
					</div>

					<div>
						<label>None</label>
						<input type="radio" name="theme-opening-bar" id="none" value="None"
							onChange={handlePressed}/>
					</div>
				</div>

				{comp_map[pressed]}

				<br></br>
				<input type="submit" value="Submit"></input>
			</form>
		</div>
	)
}

export default Preferences