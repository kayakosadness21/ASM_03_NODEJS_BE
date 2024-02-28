"use strict"
const ModelProduct = require("../models/product");

class ServiceProduct {


    constructor() { }

    async getProductById(id="") {
        try {
            return await ModelProduct.findOne({_id: {$eq: id}});

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceProduct();