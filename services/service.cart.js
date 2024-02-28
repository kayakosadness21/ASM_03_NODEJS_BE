"use strict"
const ModelCart = require("../models/model.cart");


class ServiceCart {

    constructor() { }


    async getCartByUser(userId = "") {
        try {
            return await ModelCart
            .findOne({user: {$eq: userId}})
            .populate([
                "user",
                "collections.product"
            ])
            .lean();

        } catch (error) {
            return null;
        }
    }


    async findCartByUser(userId = "") {
        try {
            return await ModelCart.findOne({user: {$eq: userId}});
        } catch (err) {
            return null;
        }
    }

    async addCart(user = {}, product = {}) {
        try {
            let cart = await this.findCartByUser(user._id);

            if(cart) {
                let productExist = cart.collections.some((elm) => elm.product.toString() === product._id.toString());

                if(productExist) {
                    cart.collections = cart.collections.map((elm) => {
                        if(elm.product.toString() === product._id.toString()) {
                            elm.quantity++;
                        }
                        return elm;
                    })

                } else {
                    cart.collections.push({product, quantity: 1});
                }
                await cart.save();

            } else {
                cart = await ModelCart.create({user, collections: [{product, quantity: 1}]});
                user.cart = cart;
                await user.save();
            }

            return {status: true, message: "Add product cart success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

}


module.exports = new ServiceCart();