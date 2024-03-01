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
            return await ModelUser.findOne({_id: {$eq: id}}).lean();
        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Find user by ID
    async findUserById(id="") {
        try {
            let user = await ModelUser
            .findOne({_id: {$eq: id}})
            .populate(['role']);

            return {status: true, user};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Find user by Email
    async findUserByEmail(email="") {
        try {
            let user = await ModelUser
            .findOne({email: {$eq: email}})
            .populate(['role']);

            return {status: true, user};

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

    // Update user account
    async updateUser(infor = {}) {
        try {
            let {status: roleStatus, role} = await ServiceRole.findRoleById(infor.role);
            let { status: userStatus, user } = await this.findUserById(infor.id);

            if(!roleStatus || !userStatus) {
                return {status: false, message: "Create user unsuccess"};
            }

            if(user.role && (role._id.toString() !== user.role._id.toString())) {
                user.role.users = user.role.users.filter((userRole) => userRole._id.toString() !== infor.id);
                await user.role.save();

                user.role = role;
                role.users.push(user);
                await role.save();
            }

            if(!user.role) {
                user.role = role;
                role.users.push(user);
                await role.save();
            }

            user.fullName = infor.fullName;
            user.email = infor.email;
            user.phoneNumber = infor.phoneNumber;
            user.address = infor.address;

            await user.save();

            return {status: true, message: "Create user success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }

    // Delete user account
    async destroyUser(id="") {
        try {
            let { status, user } = await this.findUserById(id);

            if(!status) {
                return {status: false, message: "Destroy user unsuccess"};
            }

            user.role.users = user.role.users.filter((userRole) => userRole._id.toString() !== id);
            await user.role.save();
            await user.deleteOne();
            return {status: true, message: "Destroy user success"};

        } catch (err) {
            return {status: false, message: err.message};
        }
    }
}

module.exports = new ServiceUser();