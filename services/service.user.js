"use strict"
const ModelUser = require("../models/user");
const ServiceRole = require("./service.role");

class ServiceUser {


    constructor() { }

    // Get All User
    async getAllUser() {
        try {
            return await ModelUser
            .find()
            .populate(["role"])
            .lean();
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
            let {status, role} = await ServiceRole.findRoleById(infor.role);
            if(!status) {
                return {status: false, message: "Create user unsuccess"};
            }

            let user = await ModelUser.create({
                fullName: infor.fullName,
                email: infor.email,
                password: infor.password,
                phoneNumber: infor.phoneNumber,
                address: infor.address,
                role
            })

            role.users.push(user);
            await role.save();
            return {status: true, message: "Create user success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Delete user account
    async destroyUser(id="") {
        try {
            await ModelUser.deleteOne({_id: {$eq: id}});
            return {status: true, message: "Destroy user success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceUser();