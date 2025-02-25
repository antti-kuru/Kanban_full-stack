import express, {Express,Response, Request} from "express"
import mongoose, {Connection} from "mongoose"
import morgan from "morgan"
import router from "./routes/router"
import cors, {CorsOptions} from "cors"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const port: number = 1234

const app: Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Database address
const mongoDB: string = "mongodb://localhost:27017/Project"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

app.use("/", router)

if (process.env.NODE_ENV === 'development') {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('../..', 'client', 'build')))
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve('../..', 'client', 'build', 'index.html'))
    })
}

// use morgan to prin stuff in terminal
app.use(morgan("dev"))

db.on("error", console.error.bind(console, "Error while connecting MongoDB"))

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})