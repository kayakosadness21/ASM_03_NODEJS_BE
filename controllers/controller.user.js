"use strict"
const validator = require("express-validator");
const ServiceUser = require("../services/service.user");
const UtilBcrypt = require("../utils/util.bcrypt");

class ControllerUser {

    constructor() {}

    async getAllUser(req, res, next) {
        try {
            let users = await ServiceUser.getAllUser();
            return res.status(200).json({status: true, users});
        } catch (err) {
            return res.status(400).json({status: false, users: []});
        }
    }


    async newUserAccount(req, res, next) {
        const error = validator.validationResult(req);
        const { fullName, email, password, phoneNumber, address } = req.body;

        // Validate user input
        if (!(fullName || email || password || phoneNumber)) {
            return res.status(400).send("All input is required");
        }

        // Check error
        if (!error.isEmpty()) {
            let statusCode = 400;
            switch(error.array()[0].msg) {
                case "Enter fullName atleast 5 characters and max 20 characters":
                    statusCode = 424;
                    break

                case "Enter email is invalid, try again":
                    statusCode = 420;
                    break

                case "Email is existed, please try again":
                    statusCode = 421;
                    break

                case "Length of password from 6-9 character.":
                case "Password have to contain upper case, lower case & number":
                    statusCode = 422;
                    break

                case "Length of phone number from 9 - 12. and is number":
                case "Your input is not type of phone number":
                default:
                    statusCode = 423;
                    break
            }
            return res.status(statusCode).json({status: false, message: error.array()[0].msg});
        }

        let user = await ServiceUser.createUser({
            fullName, email,
            password: UtilBcrypt.hash(password),
            phoneNumber, address
        })

        if(!user) {
            return res.status(400).json({status: false, message: "User new unsuccesss"});
        }
        return res.status(200).json({status: true, message: "User new successs"});
    }
}

module.exports = new ControllerUser();