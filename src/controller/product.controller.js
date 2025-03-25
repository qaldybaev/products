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
        let {
            limit = 10,
            page = 1,
            sortField = "id",
            sortOrder = "ASC",
            fields,
            minPrice,
            maxPrice
        } = req.query;

        if (Array.isArray(limit)) limit = limit[0];
        if (Array.isArray(page)) page = page[0];

        limit = Number(limit);
        page = Number(page);

        if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
            return res.status(400).send({
                message: `Limit yoki page noto'g'ri kiritildi!`
            });
        }

        const sortFieldArr = ["id", "name", "price", "createdAt"];
        const sortOrderArr = ["ASC", "DESC"];

        if (!sortFieldArr.includes(sortField) || !sortOrderArr.includes(sortOrder)) {
            return res.status(400).send({
                message: `sortField: ${sortField} yoki sortOrder: ${sortOrder} noto'g'ri kiritildi!`
            });
        }

        const skip = (page - 1) * limit;
        const order = sortOrder === "ASC" ? 1 : -1;

        let filterQuery = {};

        if (minPrice || maxPrice) {
            filterQuery.price = {};
            if (minPrice) {
                filterQuery.price.$gte = Number(minPrice);
            }
            if (maxPrice) {
                filterQuery.price.$lte = Number(maxPrice);
            }
        }

        let selectFields = fields ? fields.split(",").map(field => field.trim()) : [];

        let query = Product.find(filterQuery)
            .sort({ [sortField]: order })
            .limit(limit)
            .skip(skip);

        if (selectFields.length > 0) {
            query = query.select(selectFields.join(" "));
        }

        const totalCount = await Product.countDocuments();
        const products = await query;

        res.status(200).send({
            status: "success✅",
            message: "Barcha mahsulotlar",
            totalCount,
            data: {
                limit,
                page,
                products
            }
        });
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: "Mahsulotlarni olishda xatolik❌"
        });
    }
};


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
