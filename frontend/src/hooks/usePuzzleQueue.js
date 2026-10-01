import { useState, useEffect } from "react"
import { getBatch, getDaily } from "../services/puzzleService"


export function usePuzzleQueue({ menuOpen }) {
	const [puzzle, setPuzzle] = useState(null) 
	const [puzzleQueue, setPuzzleQueue] = useState([])
	const [puzzleMemory, setPuzzleMemory] = useState([])
	const [dailyPuzzle, setDailyPuzzle] = useState(null)
	
	// Set batch of puzzles in queue, or set first puzzle if !puzzle
	function setBatch(puzzles) {
		if (!puzzle) {
			const [firstPuzzle, ...remainingPuzzles] = puzzles
			setPuzzle(firstPuzzle)
			console.log('current puzzle:', firstPuzzle)
			setPuzzleQueue(remainingPuzzles)
			return
		}
		setPuzzleQueue([...puzzleQueue, ...puzzles])
	}

	// Fetch puzzles when menuOpen is "Puzzles" and queue is empty, or fetch daily puzzle when menuOpen is "DailyPuzzle"
	useEffect(() => {
		if (menuOpen === "DailyPuzzle") {
			if (dailyPuzzle) {
				return
			}
			const controller = new AbortController() //
			const puzzleDaily = async () => {
				try {
					const result = await getDaily(controller.signal)
					// Only set batch if fetch was not aborted
					if (!controller.signal.aborted) {
						setDailyPuzzle(result)
						console.log('daily puzzle:', result)
					}
				} catch (error) {
					if (error.name !== 'AbortError') { // Ignore abort errors
						console.error(error)
					}
				}
			}
			puzzleDaily()

			return () => {
				controller.abort() // Abort fetch if new batch is requested 
			}
		}

		if (menuOpen === "Puzzles") {
			if (puzzleQueue.length > 1) {
				return
			}
			// Create AbortController to cancel fetch because strict mode calls useEffect twice in development
			const controller = new AbortController()
			const puzzleBatch = async () => {
				try {
					const result = await getBatch(controller.signal)
					// Only set batch if fetch was not aborted					
					if (!controller.signal.aborted) {
						setBatch(result)
					}
				} catch (error) {
					if (error.name !== 'AbortError') { // Ignore abort errors
						console.error(error)
					}
				}
			}
			puzzleBatch()
			return () => {
				controller.abort() // Abort fetch if new batch is requested 
			}
		}
	}, [puzzleQueue.length, menuOpen, dailyPuzzle])

	// Handle moving to next puzzle in queue
	function handleNextPuzzle() {
		if (!puzzle || puzzleQueue.length === 0 || menuOpen !== "Puzzles") {
			return
		}

		const [nextPuzzle, ...remainingPuzzles] = puzzleQueue

		setPuzzleMemory([
			...puzzleMemory,
			puzzle,
		])
		if(puzzleMemory.length > 10) {
			setPuzzleMemory(puzzleMemory.slice(-10))
			console.log('puzzle memory over 10, trimming to last 10 puzzles')
		}
		setPuzzle(nextPuzzle)
		console.log('current puzzle:', nextPuzzle)
		setPuzzleQueue(remainingPuzzles)
	}

	// Handle moving to previous puzzle in memory
	function handlePreviousPuzzle() {
		if (!puzzle || puzzleMemory.length === 0 || menuOpen !== "Puzzles") {
			return
		}

		const previousPuzzle = puzzleMemory[puzzleMemory.length - 1]

		setPuzzleQueue([
			puzzle,
			...puzzleQueue,
		])
		setPuzzle(previousPuzzle)
		console.log('current puzzle:', previousPuzzle)
		setPuzzleMemory(puzzleMemory.slice(0, -1))
	}

	const currentPuzzle = menuOpen === "DailyPuzzle" ? dailyPuzzle : puzzle
	const previousPuzzle = puzzleMemory[puzzleMemory.length - 1] ?? null
	const nextPuzzle = puzzleQueue[0] ?? null
	
	return {
		currentPuzzle,
		previousPuzzle,
		nextPuzzle,
		handleNextPuzzle,
		handlePreviousPuzzle,
	}
}
