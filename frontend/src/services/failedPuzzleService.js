import { getToken } from "./authService"

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

    if (!response.ok) {
        throw new Error(data.error)
    }
    return data
}

const getFailedPuzzles = async () => {
    const response = await fetch(`/api/user/failed`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}` 
        },
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }
    return data
}   

export { setFailedPuzzle, getFailedPuzzles }