"use strict"
const validator = require("express-validator");
const ServiceRole = require("../services/service.role");

class ControllerRole {

    constructor() {}

    async getAllRole(req, res, next) {
        try {
            let roles = await ServiceRole.getAllRole();
            return res.status(200).json({status: true, roles});
        } catch (err) {
            return res.status(400).json({status: false, roles: []});
        }
    }

    async newRole(req, res, next) {
        const error = validator.validationResult(req);
        const { name } = req.body;

        if (!(name)) {
            return res.status(400).send("All input is required");
        }

        if (!error.isEmpty()) {
            let statusCode = 400;
            switch(error.array()[0].msg) {
                case "Enter name role atleast 5 characters and max 20 characters":
                default:
                    statusCode = 423;
                    break
            }
            return res.status(statusCode).json({status: false, message: error.array()[0].msg});
        }

        let { status } = await ServiceRole.createRole({name});

        if(!status) {
            return res.status(400).json({status: false, message: "Role new unsuccesss"});
        }
        return res.status(200).json({status: true, message: "Role new successs"});
    }
}

module.exports = new ControllerRole();