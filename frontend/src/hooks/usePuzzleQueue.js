import { useState, useEffect} from "react"
import { getBatch, getDaily } from "../services/puzzleService"


export function usePuzzleQueue({menuOpen}) {
    const [puzzle, setPuzzle] = useState(null)
    const [puzzleQueue, setPuzzleQueue] = useState([])
    const [puzzleMemory, setPuzzleMemory] = useState([])
    const [dailyPuzzle, setDailyPuzzle] = useState(null)
    
    // Fetch puzzles when menuOpen is "Puzzles" and queue is empty, or fetch daily puzzle when menuOpen is "DailyPuzzle"
    useEffect(() => {
        if (menuOpen === "DailyPuzzle") {
            if(dailyPuzzle) {
                setPuzzle(dailyPuzzle)
                console.log('current puzzle:', dailyPuzzle)
                return
            }
            setPuzzle(null)
            const controller = new AbortController()
            const puzzleDaily = async () => {
			try {
				const result = await getDaily(controller.signal) 
				// Only set batch if fetch was not aborted
				if (!controller.signal.aborted) {
					setPuzzle(result)
                    setDailyPuzzle(result)
                    console.log('current puzzle:', result)
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
            if (puzzleQueue.length !== 0) {
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

	}, [puzzleQueue.length, menuOpen])

    // Set batch of puzzles and update the current puzzle and queue
    function setBatch(puzzles) {
        const [firstPuzzle, ...remainingPuzzles] = puzzles
        if(puzzle !== dailyPuzzle) {
            console.log('current puzzle:', puzzle) 
            setPuzzleQueue(puzzles)
        } else {
            setPuzzle(firstPuzzle)
            console.log('current puzzle:', firstPuzzle)
            setPuzzleQueue(remainingPuzzles)
        }
    }

    // Handle moving to next puzzle in queue
    function handleNextPuzzle() {
        if (!puzzle || puzzleQueue.length === 0 || menuOpen === "DailyPuzzle") {
            return
        }

        const [nextPuzzle, ...remainingPuzzles] = puzzleQueue

        setPuzzleMemory([
            ...puzzleMemory,
            puzzle,
        ])
        if (puzzleMemory.length > 10) {
            setPuzzleMemory(puzzleMemory.slice(-10)) 
        }
        setPuzzle(nextPuzzle)
        console.log('current puzzle:', nextPuzzle)
        setPuzzleQueue(remainingPuzzles)
    }

    // Handle moving to previous puzzle in memory
    function handlePreviousPuzzle() {
        if (!puzzle || puzzleMemory.length === 0 || menuOpen === "DailyPuzzle") {
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

    return {
        puzzle,
        handleNextPuzzle,
        handlePreviousPuzzle,
    }
}