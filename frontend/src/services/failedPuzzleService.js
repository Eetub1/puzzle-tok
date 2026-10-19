import { getToken } from "./authService"
import { setPuzzleAttempt } from "./puzzleAttemptService"

const setFailedPuzzle = async (puzzleId) => {
    const response = await fetch(`/api/user/failed`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ puzzleId})
    })
    const data = await response.json()
    setPuzzleAttempt(puzzleId, false).catch((error) => {
        console.error("Failed to set puzzle attempt:", error)
    })
    if (!response.ok) {
        throw new Error(data.error)
    }
    return data
}

const getFailedPuzzles = async (signal) => {
    const response = await fetch(`/api/user/failed`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${getToken()}` 
        },
        signal
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }
    return data
}   

const removeFailedPuzzle = async (puzzleId) => {
    const response = await fetch(`/api/user/failed/${puzzleId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${getToken()}` 
        },
    })
    const data = await response.json()  
    if (!response.ok) {
        throw new Error(data.error)
    }
    return data
}

export { setFailedPuzzle, getFailedPuzzles, removeFailedPuzzle }