import { Router } from "express";
import route from "./product.route.js";

const productRoute = Router()

productRoute.use("/products",route)

export default productRoute;