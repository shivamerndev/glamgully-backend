import productModel from "../models/product.model.js";
import { productValidator } from "../validator/product.validator.js"
import { getCloudinaryResponse, uploadMultipleImages } from "../utils/cloudinary.js"

export const createProduct = async (req, res) => {
    try {
        const { title, price, discount, description, category, quantity } = req.body;
        // const productimage = req.file;
        const productimage = req.files;
        const { error } = productValidator(req.body)
        if (error) return res.status(400).json({ error_message: error.details[0].message })
        if (!productimage) return res.status(400).json({ error: "Product image is required" })
        // const imageurl = await getCloudinaryResponse(productimage)
        const imageurls = await uploadMultipleImages(productimage)
        const Product = await productModel.create({
            productimage: imageurls,
            title,
            price,
            discount,
            description,
            category,
            quantity
        });
        res.status(201).json({ message: "Product created successfully", product: Product });
    } catch (err) {
        res.send(err.message);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({ isActive: { $ne: false } })
        res.status(200).send(products)
    } catch (error) {
        res.send(error.message)
    }
}
export const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await productModel.find().select('-productimage');
        res.status(200).send(products)
    } catch (error) {
        res.send(error.message)
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findOne({ _id: productId })
        res.send(product)
    } catch (error) {
        res.send(error.message)
    }
}

export const editProduct = async (req, res) => {
    try {
        const newObj = req.body;
        let product = await productModel.findOne({ _id: newObj._id });
        if (!product) return res.status(404).send("Product not found");

        // Update product fields with newObj values
        Object.keys(newObj).forEach(key => {
            if (key !== "_id") {
                product[key] = newObj[key];
            }
        });
        await product.save();
        res.status(200).send(product);
    } catch (error) {
        res.send(error.message)
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findOneAndDelete({ _id: productId });
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        res.send(error.message)
    }
}

export const searchProduct = async (req, res) => {
    try {
        const { search } = req.body;
        if (!search || typeof search !== "string" || !search.trim()) {
            return res.status(400).json({ message: "Search term is required" });
        }
        // Use case-insensitive partial match for better search experience
        const products = await productModel.find({
            title: { $regex: search, $options: "i" }
        });
        res.status(200).json(products);
    } catch (error) {
        res.send(error.message)
    }
}