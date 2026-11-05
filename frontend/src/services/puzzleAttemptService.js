import { getToken } from "./authService"

const setPuzzleAttempt = async (puzzleId, puzzleRating, success, retryUsed) => {
    const response = await fetch(`/api/user/puzzle-attempts`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}` 
        },
        body: JSON.stringify({puzzleId, puzzleRating, success, retryUsed})
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return { playerRating: data.data.playerRating, ratingChange: data.data.ratingChange }
}

export { setPuzzleAttempt }