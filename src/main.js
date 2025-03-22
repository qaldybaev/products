import app from "./app.js"
import PORT from "./config/app.config.js"
import connectDB from "./config/mongo.config.js"

connectDB()
    .then((data) => console.log(data))
    .catch((err) => {
        console.log(err.message)
        process.exit(1)
    })

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}✅`)
})
