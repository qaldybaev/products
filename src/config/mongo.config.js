import { config } from "dotenv"
import mongoose from "mongoose"
config()

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL)
        return "MongoDB'ga ulandi✅"
    } catch (error) {

        throw new Error("Database'ga ulanishda xatolik❌")
    }
}

export default connectDB