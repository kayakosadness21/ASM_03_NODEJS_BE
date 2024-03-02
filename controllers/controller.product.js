"use strict"
const validator = require("express-validator");
const ServiceProduct = require("../services/service.product");

class ControllerProduct {

    constructor() {}

    async getAllProduct(req, res, next) {
        try {
            let {products} = await ServiceProduct.getAllProduct();
            return res.status(200).json({status: true, products});
        } catch (err) {
            return res.status(400).json({status: false, products: []});
        }
    }
}

module.exports = new ControllerProduct();