export default function calculatePuzzleRating(puzzleRating, success, playerRating, attemptCount) {
    let K
    if (attemptCount > 30) {
        K = 20
    } else if (attemptCount > 10) {
        K = 30
    } else {
        K = 40
    }
    
    const probabilityToSolve = 1 / (1 + 10 ** ((puzzleRating - playerRating) / 400))
    const newRating = playerRating + K * (success - probabilityToSolve)

    console.log("New puzzle rating calculated:", newRating, "from player rating:", playerRating, "and puzzle rating:", puzzleRating, "with success:", success)

    return Math.round(newRating)
}