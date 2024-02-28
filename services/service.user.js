"use strict"
const ModelUser = require("../models/user");

class ServiceUser {


    constructor() { }

    async getUserById(id="") {
        try {
            return await ModelUser.findOne({_id: {$eq: id}});

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceUser();