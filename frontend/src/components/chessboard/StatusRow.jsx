import './StatusRow.css'

// Component display status, current turn, move feedback
function StatusRow({ puzzle, game, playerColor, puzzleStatus, moveFeedback, attemptFailed, handleRetry, streak, playerRating, ratingChange, retryUsed }) {

	const isSolved = puzzleStatus === 'solved'

	let status = 'neutral'
	let statusText = game.turn() === playerColor ? 'Your turn' : 'Opponent turn'

	if (puzzleStatus === 'viewing') {
		statusText = 'Reviewing moves'
	}
	if (moveFeedback === 'right') {
		status = 'solved'
		statusText = 'Correct move'
	} else if (moveFeedback === 'wrong') {
		status = 'failed'
		statusText = 'Wrong move'
	}
	if (isSolved && attemptFailed) {
		status = 'failed'
		statusText = 'Puzzle ended'
	}

	let resultStatus = null
	let resultText = null

	if (attemptFailed) {
		resultStatus = 'failed'
		resultText = 'Failed'
	} else if (isSolved) {
		resultStatus = 'solved'
		resultText = '✓ Solved'
	} else if (puzzle.previouslyFailed) {
		resultStatus = 'previously-failed'
		resultText = 'Previously failed'
	}

	let ratingChangeText = ''
	if (ratingChange > 0) {
		ratingChangeText += ` (+${ratingChange})`
	} else if (ratingChange < 0) {
		ratingChangeText += ` (${ratingChange})`
	} else {
		ratingChangeText = null
	}


	return (
		<div className="puzzle-status-row">
			<div className= "puzzle-status-row-left">
				<span className='puzzle-status-rating'>Puzzle rating: {puzzle.rating}</span>
				{!retryUsed ? (
					<span className={`puzzle-status-player-rating${ratingChange < 0 ? '-decrease' : ratingChange > 0 ? '-increase' : ''}`}>
						Your rating: {playerRating} {ratingChangeText}
					</span>
				) : <span className='puzzle-status-retry'>Retry · Unrated</span> }

				{streak > 2 && (
					<span className={`puzzle-status-streak${streak > 13 ? '-ultrahigh' : streak > 8 ? '-high' : streak > 5 ? '-medium': '-low'}`}>{streak}🔥</span>
				)}
			</div>

			{(!isSolved || attemptFailed) && (
				<span className={`puzzle-status-${status}`}>{statusText}</span>
			)}
			{resultText && (
				<span className={`puzzle-status-${resultStatus}`}>{resultText}</span>
			)}
			{isSolved && (
				<button id="puzzle-retry-button-solved" className='puzzle-retry-button' onClick={handleRetry}>↻ Again</button>
			)}
			{(!isSolved && attemptFailed) && (
				<button id="puzzle-retry-button" className='puzzle-retry-button' onClick={handleRetry}>↻ Retry</button>
			)}
		</div>
	)
}
export default StatusRow
