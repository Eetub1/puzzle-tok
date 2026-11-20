import { useState, useEffect } from "react"
import {getInitialPreferences} from "../services/preferenceService"

const usePreference = () => {
	const [difficulty, setDifficulty] = useState("")
	const [color, setColor] = useState("")
	const [failed, setFailed] = useState("")
	const [theme, setTheme] = useState("")
	const [opening, setOpening] = useState("")

	// Fetch initial preferences when site opens
	useEffect(() => {

		const fetch_prefs = async () => {
			const init_prefs = await getInitialPreferences()
			setColor(init_prefs.color)
			setDifficulty(init_prefs.difficulty)
			setFailed(init_prefs.failed)
			setTheme(init_prefs.theme)
			setOpening(init_prefs.opening)
			console.log('init prefs here: ',init_prefs)
		}
		fetch_prefs()
	},[])

	return {
		difficulty,
		color,
		failed,
		theme,
		opening,
		setTheme,
		setDifficulty,
		setColor,
		setFailed,
		setOpening
	}

}

export {usePreference}