import { useState, useEffect } from "react"
import { getBatch, getDaily, getPuzzleById } from "../services/puzzleService"
import { getFailedPuzzles } from "../services/failedPuzzleService"

function shuffle(puzzles) {
	return [...puzzles].sort(() => Math.random() - 0.5)
}

export function usePuzzleQueue({ menuOpen, difficulty, color }) {
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
			console.log('puzzle queue:', remainingPuzzles)
			return
		}
		setPuzzleQueue([...puzzleQueue, ...puzzles])
	}

	// Fetch puzzles when menuOpen is "Puzzles" and queue is empty, or fetch daily puzzle when menuOpen is "DailyPuzzle"
	useEffect(() => {
		//console.log("in useEffect difficulty", difficulty)
		//console.log("in useEffect color", color)
		//console.log("in useEffect menuOpen", menuOpen)

		if (menuOpen === "DailyPuzzle") {
			if (dailyPuzzle) {
				return
			}
			const controller = new AbortController() //
			const puzzleDaily = async () => {
				try {
					const [result, failedPuzzleIds] = await Promise.all([
						getDaily(controller.signal),
						getFailedPuzzles(controller.signal),
					])
					// Only set batch if fetch was not aborted
					if (!controller.signal.aborted) {
						setDailyPuzzle({ ...result, previouslyFailed: failedPuzzleIds.includes(result.id) })
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
					const [batch, failedPuzzleIds] = await Promise.all([
						getBatch(controller.signal, difficulty, color),
						getFailedPuzzles(controller.signal),
					])

					console.log('get batch: ', batch)

					const failedPuzzles = await Promise.all(
						failedPuzzleIds.map(puzzleId => getPuzzleById(puzzleId, controller.signal))
					)
					// Only set batch if fetch was not aborted
					if (!controller.signal.aborted) {
						setBatch(shuffle([...batch, ...failedPuzzles].map(puzzle => ({
							...puzzle,
							previouslyFailed: failedPuzzleIds.includes(puzzle.id),
						}))))
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
	}, [puzzleQueue.length, menuOpen, dailyPuzzle, color, difficulty])

	// Handle moving to next puzzle in queue
	function handleNextPuzzle(savedState) {
		if (!puzzle || puzzleQueue.length === 0 || menuOpen !== "Puzzles") {
			return
		}

		const [nextPuzzle, ...remainingPuzzles] = puzzleQueue

		const updatedMemory = [
			...puzzleMemory,
			{
				...puzzle,
				savedState,
			},
		]
		
		if(updatedMemory.length > 10) {
			setPuzzleMemory(updatedMemory.slice(-10))
			console.log('puzzle memory over 10, trimming to last 10 puzzles')
		} else {
			setPuzzleMemory(updatedMemory)
		}
		setPuzzle(nextPuzzle)
		console.log('current puzzle:', nextPuzzle)
		setPuzzleQueue(remainingPuzzles)
	}

	// Handle moving to previous puzzle in memory
	function handlePreviousPuzzle(savedState) {
		if (!puzzle || puzzleMemory.length === 0 || menuOpen !== "Puzzles") {
			return
		}

		const previousPuzzle = puzzleMemory[puzzleMemory.length - 1]

		setPuzzleQueue([
        	{ 
				...puzzle, 
				savedState 
			},
        	...puzzleQueue,
    	])
		setPuzzle(previousPuzzle)
		console.log('current puzzle:', previousPuzzle)
		setPuzzleMemory(puzzleMemory.slice(0, -1))
	}

	function saveDailyPuzzleState(savedState) {
		setDailyPuzzle(dailyPuzzle ? { ...dailyPuzzle, savedState } : dailyPuzzle)
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
		saveDailyPuzzleState,
	}
}
