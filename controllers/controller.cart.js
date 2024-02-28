"use strict"
const ServiceUser = require("../services/service.user");
const ServiceProduct = require("../services/service.product");
const ServiceCart = require("../services/service.cart");
const UtilMailer = require("../utils/util.mailer");

class ControllerCart {

    constructor() { }

    async getCartByUser(req, res, next) {
        let user = req.get("user");
        return res.status(200).json({status: true, cart: await ServiceCart.getCartByUser(user)});
    }


    async addCart(req, res, next) {
        let { user, product } = req.body;
        let productInfor = await ServiceProduct.getProductById(product);
        let userInfor = await ServiceUser.getUserById(user);

        let {status, message} = await ServiceCart.addCart(userInfor, productInfor);
        // if(!status) {
        //     return res.status(400).json({status: false, message});
        // }
        // return res.status(200).json({status: true, message});
        next();
    }


    async confirmAddCart(req, res, next) {
        await UtilMailer.send("quandhFX17216@funix.edu.vn", `<h1 style="color: red;">Hello add cart success</h1>`,() => {
            next();
        })
    }

    async confirmAddCartFinal(req, res, next) {
        return res.status(200).json({status: true, message: "Add cart success"});
    }
}

module.exports = new ControllerCart();