import { useState, useEffect } from "react"
import {getInitialPreferences} from "../services/preferenceService"

const usePreference = () => {
	const [difficulty, setDifficulty] = useState("")
	const [color, setColor] = useState("")

	// Fetch initial preferences when site opens
	useEffect(() => {

		const fetch_prefs = async () => {
			const init_prefs = await getInitialPreferences()
			setColor(init_prefs.color)
			setDifficulty(init_prefs.difficulty)
			console.log(init_prefs)
		}
		fetch_prefs()
	},[])

	return {
		difficulty,
		color,
		setDifficulty,
		setColor,
	}

}

export {usePreference}