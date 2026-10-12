import './StatusRow.css'

// Component display status, current turn, move feedback
function StatusRow({ puzzle, game, playerColor, puzzleStatus, moveFeedback, attemptFailed, handleRetry }) {

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

    return (
        <div className="puzzle-status-row">
            <span className='puzzle-status-rating'>Puzzle rating: {puzzle.rating}</span>
            {(!isSolved || attemptFailed) && (
                <span className={`puzzle-status-${status}`}>{statusText}</span>
            )}
            {resultText && (
                <span className={`puzzle-status-${resultStatus}`}>{resultText}</span>
            )}  
            {attemptFailed && (
                <button className='puzzle-retry-button' onClick={handleRetry}>↻ Retry</button>
            )}
        </div>
    )
}
export default StatusRow