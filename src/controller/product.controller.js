import { isValidObjectId } from "mongoose"
import Product from "../model/mongo.model.js"

const createProduct = async (req, res) => {
    try {
        const { name, price, count } = req.body

        const newProduct = new Product({ name, price, count })

        await newProduct.save()

        res.status(200).send({
            status: "success✅",
            message: "Yangi mahsulot qoshildi",
            data: newProduct
        })
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Product qoshishda xatolik❌"
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sortField = "id", sortOrder = "ASC" } = req.query
        if (isNaN(limit) || isNaN(page)) {
            return res.send({
                message: `Limit ${limit} yoki page ${page} xato kiritldi`
            })
        }
        const sortArr = ["id", "name", "price", "count", "createdAt"]
        const sortOrderArr = ["ASC", "DESC"]
        if (!(sortArr.some(sort => sort === sortField) && sortOrderArr.some(or => or === sortOrder))) {
            return res.status(400).send({
                message: `sortField: ${sortField} yoki sortOrder: ${sortOrder} xato kiritildi!`
            });
        }
        const skip = (page - 1) * limit
        const order = sortOrder === "ASC" ? 1 : -1
        const totalCount = await Product.countDocuments()
        const products = await Product.find()
            .sort({ [sortField]: order })
            .limit(limit)
            .skip(skip)

        res.status(200).send({
            status: "sucess✅",
            message: "Barcha mahsulotlar",
            totalCount,
            data: {
                limit: Number(limit),
                page: Number(page),
                products: products
            }
        })
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Product qoshishda xatolik❌"
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).send({
                status: "error",
                message: "Noto'g'ri Id kiritildi!"
            })
        }
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).send({
                status: "error",
                message: "ID li mahsulot topilmadi!"
            });
        }

        res.status(200).send({
            status: "sucess✅",
            message: `ID: ${id} boyicha mahsulot`,
            data: product
        })
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Product olishda xatolik❌"
        })
    }
}

const updateProductPatch = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).send({
                status: "error",
                message: "Noto'g'ri Id kiritildi!"
            })
        }
        const { name, price, count } = req.body

        const updateProduct = await Product.findOneAndUpdate(
            { _id: id }, { name, price, count }, { new: true }
        )

        if (!updateProduct) {
            return res.status(404).send({
                status: "error",
                message: "ID li mahsulot topilmadi!"
            });
        }

        res.status(200).send({
            status: "success✅",
            message: "Mahsulot yangilandi",
            data: updateProduct
        })

    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Product yangilashda xatolik❌"
        })
    }

}

const updateProductPut = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).send({
                status: "error",
                message: "Noto'g'ri Id kiritildi!"
            })
        }
        const { name, price, count } = req.body

        if (!name || !price || !count) {
            return res.status(404).send({
                status: "error",
                message: "Barcha malumot kiritilishi shart!"
            })
        }

        const updateProduct = await Product.findOneAndUpdate(
            { _id: id }, { name, price, count }, { new: true }
        )

        if (!updateProduct) {
            return res.status(404).send({
                status: "error",
                message: "ID li mahsulot topilmadi!"
            });
        }

        res.status(200).send({
            status: "success✅",
            message: "Mahsulot yangilandi",
            data: updateProduct
        })

    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Product yangilashda xatolik❌"
        })
    }

}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(404).send({
                status: "error",
                message: "Noto'g'ri Id kiritildi!"
            })
        }
        const deleteProduct = await Product.findByIdAndDelete(id)

        if (!deleteProduct) {
            return res.status(404).send({
                status: "error",
                message: "ID li mahsulot topilmadi!"
            });
        }

        res.status(204).send()

    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Product o'chirishda xatolik❌"
        })
    }
}
export default { createProduct, getAllProducts: getAllProducts, getProductById, updateProductPatch, deleteProduct, updateProductPut }