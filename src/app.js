import express from "express"
import productRoute from "./routes/index.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api",productRoute)

app.all("/*",(req,res) => {
    res.status(404).json({
        message:`Given URL: ${req.url} not found`
    })
})

export default app