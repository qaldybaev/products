import { config } from "dotenv";

config()

const PORT = +process.env.APP_PORT || 5000

export default PORT