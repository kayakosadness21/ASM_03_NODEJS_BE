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
                case "Role is existed, please try again":
                    statusCode = 421;
                    break

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

    async destroyRole(req, res, next) {
        let { id } = req.body;
        const error = validator.validationResult(req);

        if (!error.isEmpty()) {
            let statusCode = 400;
            switch(error.array()[0].msg) {
                case "ID role can't empty":
                    statusCode = 400;
                    break

                case "Role has associated can't destroy":
                default:
                    statusCode = 403;
                    break
            }
            return res.status(statusCode).json({status: false, message: error.array()[0].msg});
        }

        let { status } = await ServiceRole.destroyRole(id);
        if(!status) {
            return res.status(400).json({status: false, message: "Role destroy unsuccesss"});
        }
        return res.status(200).json({status: true, message: "Role destroy successs"});
    }
}

module.exports = new ControllerRole();