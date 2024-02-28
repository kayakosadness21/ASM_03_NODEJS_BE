"use strict"
const ServiceUser = require("../services/service.user");

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
}

module.exports = new ControllerUser();