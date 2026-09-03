
import express from "express"
import compression from "compression"

const port = 8080
const app = express()

app.use(compression())
app.use(express.static("x/client"))
app.listen(port, "0.0.0.0", () => console.log(`📡 listening on ${port}`))

