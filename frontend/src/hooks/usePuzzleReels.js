import { useState, useRef } from "react"

export function usePuzzleReels({ menuOpen, handleNextPuzzle, handlePreviousPuzzle }) {

	const [slideIndex, setSlideIndex] = useState(1)
	const [animating, setAnimating] = useState(false)
	const [transition, setTransition] = useState(true)
	const [direction, setDirection] = useState(null)
	const isPuzzlesMenu = Boolean(menuOpen === "Puzzles")
	const lockRef = useRef(false)
	const silenceTimeoutRef = useRef(null)


	// Handle moving to next puzzle in queue
	function goNext() {
		if (!isPuzzlesMenu || animating ) {
			return
		}
		lockRef.current = true
		setDirection("next")
		setSlideIndex(2)
		setTransition(true)
		setAnimating(true)
	}

	// Handle moving to previous puzzle in memory
	function goPrev() {
		if (!isPuzzlesMenu || animating ) {
			return
		}
		lockRef.current = true
		setDirection("prev")
		setSlideIndex(0)
		setTransition(true)
		setAnimating(true)
	}

	// Handle transition end
	function handleTrackTransitionEnd() {
		if (!direction) {
			return
		}
		if (direction === "next") {
			handleNextPuzzle()
		} else {
			handlePreviousPuzzle()
		}
		setDirection(null)
		setTransition(false)
		setSlideIndex(1)
		setAnimating(false)
		requestAnimationFrame(() => {
			setTransition(true)
		})
		releaseAfterSilence()
	}

	// Handle wheel events for scrolling puzzles
	function handleWheel(event) {
		if (lockRef.current || animating) {
			releaseAfterSilence()
			return
		}
		if(event.deltaY > 20) {
			goNext()
			return
		}
		if(event.deltaY < -20) {
			goPrev()
			return
		}
	}

	// Release lock after short timeout to allow new wheel events
	function releaseAfterSilence() {
		clearTimeout(silenceTimeoutRef.current)
		silenceTimeoutRef.current = setTimeout(() => {
			lockRef.current = false
		}, 100)
	}

	return { isPuzzlesMenu,
		slideIndex,
		transition,
		goNext,
		goPrev,
		handleTrackTransitionEnd,
		handleWheel
	}
}