"use strict"
const mongodb = require("mongodb");
const ModelRole = require("../models/model.roles");
const {ObjectId} = mongodb;

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
            let role = await ModelRole.findOne({title: {$eq: name}}).lean();
            return {status: role? true : false, role};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Get role by ID
    async getRoleById(id="") {
        try {
            let role = await ModelRole.findOne({_id: {$eq: id}}).lean();
            return {status: role? true : false, role};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Find role by ID
    async findRoleById(id="") {
        try {
            let role = await ModelRole.findOne({_id: {$eq: id}});
            return {status: role? true : false, role};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    async findRoleByName(name="") {
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

    // Update Role
    async updateRole(infor = {}) {
        try {
            let { status, role } = await this.findRoleById(infor.id);
            if(!status) {
                return {status: false, message: "Update role unsuccess"};
            }
            
            role.title = infor.name;
            await role.save();
            return {status: true, message: "Update role success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Destroy role account
    async destroyRole(id="") {
        try {
            let { status, role } = await this.findRoleById(id);
            if(!status || role.users.length) {
                return {status: true, message: "Destroy role unsuccess"};
            }
            await role.deleteOne();
            return {status: true, message: "Destroy role success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceRole();