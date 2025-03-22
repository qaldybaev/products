import { Router } from "express";
import productController from "../controller/product.controller.js";


const route = Router()

route
    .post("/", productController.createProduct)
    .get("/", productController.getAllProducts)
    .get("/:id", productController.getProductById)
    .patch("/:id",productController.updateProductPatch)
    .put("/:id",productController.updateProductPut)
    .delete("/:id",productController.deleteProduct)

export default route;