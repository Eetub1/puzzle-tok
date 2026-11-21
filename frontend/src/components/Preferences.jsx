import { useState} from "react"
import { prefChange } from "../services/preferenceService"
import { themes } from "../themes.js"
import { openings } from "../openings.js"
import { Button } from "react-bootstrap"
import "./Preferences.css"

const Preferences = ({user_id, difficulty, color, failed, theme, opening, setDifficulty, setColor, setFailed, setTheme, setOpening, showMessage}) => {
	const [pressed, setPressed] = useState("")
	const [relevantThemes, setRelevantThemes] = useState([])
	const [relevantOpenings, setRelevantOpenings] = useState([])
	const [themeText, setThemeText] = useState("")
	const [openingText, setOpeningText] = useState("")

	const handleSubmit = async event => {
		event.preventDefault()

		try {
			const data = await prefChange({ color, difficulty, failed, theme, opening, user_id })
			console.log('pref jsx data!:', data)
			showMessage('Preferences saved succesfully')

		} catch (error) {
			console.log("Error with setting preferences: ", error)
			showMessage('Error with setting preferences')
		}

	}

	const handlePressed = async event => {

		console.log('pressed:', event.target.value)
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

	const handleThemeSearch = async event => {

		setThemeText(event.target.value)

		setRelevantThemes(themes.filter( theme =>
			theme.toLowerCase().includes(event.target.value.toLowerCase())
		))
	}

	const handleThemeSelect = async t => {
		setTheme(t)
		setThemeText(t)
		setRelevantThemes({})
	}

	const handleOpeningSearch = async event => {
		setOpeningText(event.target.value)
		setRelevantOpenings(openings.filter( opening =>
			opening.toLowerCase().includes(event.target.value)
		))
	}

	const handleOpeningSelect = async t => {
		setOpening(t)
		setOpeningText(t)
		setRelevantOpenings({})
	}

	const comp_map = {
		'Theme':
		<div>
			<input type="text" value={themeText} onChange={handleThemeSearch} className="theme-input"/>
			<br></br>

			{relevantThemes.length > 0 && themeText.length > 2 ?
				relevantThemes.map(theme => (
					<div key={theme} className="search-row"> {theme}
						<Button onClick={() => handleThemeSelect(theme)} className="search-button">Choose</Button>
					</div>
				)) :
				<></>
			}

		</div>,

		'Opening':
		<div>
			<input type="text" value={openingText} onChange={handleOpeningSearch} className="opening-input"></input>
			<br></br>

			{relevantOpenings.length > 0 && openingText.length > 3 ?
				relevantOpenings.map(opening => (
					<div key={opening} className="search-row"> {opening}
						<Button onClick={() => handleOpeningSelect(opening)} className="search-button">Choose</Button>
					</div>
				)) :
				<></>
			}

		</div>,

		'None':
		<></>
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="filter-row">
					<label className="labelling"> Color </label>
					<select className="selection" id="colors"
						value={color} onChange={(event) => setColor(event.target.value)}>
						<option value="black">Black</option>
						<option value="white">White</option>
						<option value="both">Both</option>
					</select>
					<br></br>
				</div>

				<div className="filter-row">
					<label className="labelling" >Difficulty</label>
					<select className="selection" id="difficulties"
						value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
						<option value="easiest">Easiest</option>
						<option value="easier">Easier</option>
						<option value="normal">Normal</option>
						<option value="harder">Harder</option>
						<option value="hardest">Hardest</option>
					</select>
					<br></br>
				</div>

				<div className="filter-row">
					<label className="labelling" >Failed </label>
					<select className="selection" id="failed"
						value={failed} onChange={(event) => setFailed(event.target.value)}>
						<option value="normal">Normal</option>
						<option value="failed">Failed</option>
					</select>
					<br></br>
				</div>

				<div className="filter-row">
					<label className="labelling" >Angle </label>
					<select className="selection" id="theme"
						value={pressed} onChange={handlePressed}>
						<option value="Theme">Theme</option>
						<option value="Opening">Opening</option>
						<option value="None">None</option>
					</select>
					<br></br>
				</div>

				{comp_map[pressed]}

				<br></br>
				<input type="submit" value="Save" className="save-btn"></input>
			</form>
		</div>
	)
}

export default Preferences