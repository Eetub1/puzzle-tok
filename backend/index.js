const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Kaikki toimii")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})