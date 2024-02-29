"use strict"
const ModelUser = require("../models/user");

class ServiceUser {


    constructor() { }

    // Get All User
    async getAllUser() {
        try {
            return await ModelUser.find().lean();
        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Get user by ID
    async getUserById(id="") {
        try {
            return await ModelUser.findOne({_id: {$eq: id}});
        } catch (err) {
            return {status: false, message: err.message};
        }
    }


    // Create user account
    async createUser(infor = {}) {
        try {
            return await ModelUser.create({
                fullName: infor.fullName,
                email: infor.email,
                password: infor.password,
                phoneNumber: infor.phoneNumber,
                address: infor.address
            })

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceUser();