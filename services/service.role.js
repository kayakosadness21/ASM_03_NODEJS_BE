"use strict"
const ModelRole = require("../models/model.roles");

class ServiceRole {


    constructor() { }

    // Get All role
    async getAllRole() {
        try {
            return await ModelRole.find().lean();
        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Get role by ID
    async getRoleByName(name="") {
        try {
            let role = await ModelRole.findOne({title: {$eq: name}});
            return {status: role? true : false, role};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }


    // Create role account
    async createRole(infor = {}) {
        try {
            await ModelRole.create({
                title: infor.name,
            })

            return {status: true, message: "Create role success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceRole();