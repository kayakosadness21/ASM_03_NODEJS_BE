"use strict"
const ModelProduct = require("../models/product");
const UtilCloudinary = require("../utils/util.cloudinary");

class ServiceProduct {


    constructor() { }

    async getAllProduct() {
        try {
            let products = await ModelProduct.find().lean();
            return {status: true, products};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    async getProductById(id="") {
        try {
            return await ModelProduct.findOne({_id: {$eq: id}}).lean();

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    async findProductById(id="") {
        try {
            return await ModelProduct.findById(id);
        } catch (err) {
            return null;
        }
    }

    async newProduct(infor = {}) {
        try {
            const product = await ModelProduct.create({
                category: infor.category,
                name: infor.name,
                long_desc: infor.long_desc,
                short_desc: infor.short_desc,
                price: infor.price,
                quantity: infor.quantity,
                images: infor.images,
            });

            if(!product) {
                return { status: false, message: "Product new unsuccess"};
            }
            return { status: true, message: "Product new success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    async updateProduct(infor = {}) {
        try {
            let product = await this.findProductById(infor.id);

            if(!product) {
                return {status: false, message: "Update product unsuccess"};
            }

            product.name = infor.name;
            product.category = infor.category;
            product.long_desc = infor.long_desc;
            product.short_desc = infor.short_desc;
            product.price = infor.price;
            product.quantity = infor.quantity;
            await product.save();
            return {status: true, message: "Update product success"};

        } catch (err) {
            return {status: false, message: "Update product unsuccess"};
        }
    }

    async destroyProduct(infor = {}) {
        try {
            let product = await this.findProductById(infor.id);

            if(product.images.length && product.images.every((image) => image.includes("cloudinary"))) {

                for(let image of product.images) {
                    let imageName = image.split('/').splice(-1).join('').split(".")[0];
                    let {status, result } = await UtilCloudinary.exists(`${process.env.CLOUDINARY_DIRECTORY}/${imageName}`);
                    if(status) {
                        await UtilCloudinary.destroy(`${process.env.CLOUDINARY_DIRECTORY}/${imageName}`);
                        break;
                    }
                }
            }

            await product.deleteOne();

            if(!product) {
                return { status: false, message: "Product destroy unsuccess"};
            }
            return { status: true, message: "Product destroy success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceProduct();