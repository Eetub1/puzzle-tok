const backendURL = "http://localhost:3000" //TO DO: MOVE

const getDaily = async (response) => {
    response = await fetch(`${backendURL}/api/puzzles/daily`)
    console.log('daily puzzle !')
    return response.json()
}

export {getDaily}