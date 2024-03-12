"use strict"
const validator = require("express-validator");
const ServiceProduct = require("../services/service.product");

class ControllerProduct {

    constructor() { }

    async getAllProduct(req, res, next) {
        try {
            let { products } = await ServiceProduct.getAllProduct();
            return res.status(200).json({ status: true, products });
        } catch (err) {
            return res.status(400).json({ status: false, products: [] });
        }
    }
    // Vao product list xet detail theo ID 
    async getProductById(req, res, next) {
        try {
            let { id } = req.params;
            let product = await ServiceProduct.getProductById(id);
            return res.status(200).json({ status: true, product });
        } catch (err) {
            return res.status(400).json({ status: false, product: null });
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id, category, long_desc, name, short_desc, price, quantity } = req.body;
            let { status, message } = await ServiceProduct.updateProduct({
                id, category, long_desc, name, short_desc, price, quantity
            })

            if (!status) {
                return res.status(400).json({ status, message });
            }

            return res.status(200).json({ status, message });

        } catch (err) {
            return res.status(400).json({ status: false, message: "Update product unsuccess" });
        }
    }

    async destroyProduct(req, res, next) {
        try {
            const { id } = req.body;
            let { status, message } = await ServiceProduct.destroyProduct({ id })

            if (!status) {
                return res.status(400).json({ status, message });
            }

            return res.status(200).json({ status, message });

        } catch (err) {
            return res.status(400).json({ status: false, message: "Update product unsuccess" });
        }
    }
}

module.exports = new ControllerProduct();