import mongoose from "mongoose";

const productShema = new mongoose.Schema({
    name: String,
    price: Number,
    count: Number
},
    {
        timestamps: true,
        versionKey: false,
        collection: "products"
    }
)


const Product = mongoose.model("products", productShema)
export default Product;