import { useEffect, useRef, useState } from 'react'

export function useStockfish(fen, enabled = true) {
	const [evalScore, setEvalScore] = useState(0)
	const [mateIn, setMateIn] = useState(null)
	const [bestMove, setBestMove] = useState(null)
	const engineRef = useRef(null)
	const fenRef = useRef(fen)

	useEffect(() => {
		fenRef.current = fen
	}, [fen])


	useEffect(() => { 	// Initialize Stockfish Web Worker once when enabled
		if (!enabled) return

		const engine = new Worker('/stockfish-19-lite-single.js')
		engineRef.current = engine

		engine.postMessage('uci')
		engine.postMessage('isready')

		engine.onmessage = (event) => {
			const line = typeof event.data === 'string' ? event.data : ''

			if (line.startsWith('info') && line.includes('score')) {
				// Stockfish reports scores from the side-to-move's perspective;
				// flip sign when it's black's turn so + always favors white
				const turnMultiplier = fenRef.current.split(' ')[1] === 'w' ? 1 : -1

				const mateMatch = line.match(/score mate (-?\d+)/)
				const cpMatch = line.match(/score cp (-?\d+)/)

				if (mateMatch) {
					setMateIn(parseInt(mateMatch[1], 10) * turnMultiplier)
				} else if (cpMatch) {
					setMateIn(null)
					setEvalScore(parseInt(cpMatch[1], 10) * turnMultiplier)
				}
			}


			if (line.startsWith('bestmove')) { // Please parse the best move
				const move = line.split(' ')[1]
				if (move && move !== '(none)') {
					setBestMove(move)
				}
			}
		}

		return () => {
			engine.terminate()
			engineRef.current = null
		}
	}, [enabled])

	// Trigger evaluation whenever the FEN changes
	useEffect(() => {
		if (!enabled || !engineRef.current) return

		engineRef.current.postMessage('stop')
		engineRef.current.postMessage(`position fen ${fen}`)
		engineRef.current.postMessage('go depth 14')
	}, [fen, enabled])

	return { evalScore, mateIn, bestMove }
}