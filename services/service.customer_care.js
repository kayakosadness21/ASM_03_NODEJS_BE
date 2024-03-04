"use strict"
const ModelCustomerCare = require("../models/model.customer_car");
const ServiceUser = require("./service.user");

class ServiceCustomerCare {
    
    constructor() { }

    async getListUserOnline() {
        return await ModelCustomerCare
        .find({status: {$eq: true}})
        .populate([
            {
                path: 'user',
                populate: [{
                    path: 'role'
                }]
            }
        ])
        .lean();
    }

    async findAdminById(id) {
        return await ModelCustomerCare.findOne({user: {$eq: id}});
    }

    async findAdminByEmail(email) {
        return await ModelCustomerCare.findOne({email: {$eq: email}});
    }

    async findClientByEmail(email) {
        return await ModelCustomerCare.findOne({email: {$eq: email}});
    }

    async findUserCareByEmail(email = "") {
        return await ModelCustomerCare.findOne({email: {$eq: email}});
    }

    async activeUser(infor = {}) {
        let userInfor = await ModelCustomerCare.findOne({email: {$eq: infor.userEmail}});
        if(!userInfor) {
            let { status, user } = await ServiceUser.findUserById(infor.userId);

            if(status) {
                await ModelCustomerCare.create({
                    user,
                    email: infor.userEmail,
                    socket_id: infor.socketId,
                    status: true,
                })
            }

        } else {
            userInfor.socket_id = infor.socketId;
            userInfor.status = true;
            await userInfor.save();
        }

        return await ModelCustomerCare
        .find({status: {$eq: true}})
        .populate([
            {
                path: 'user',
                populate: [{
                    path: 'role'
                }]
            }
        ])
        .lean();
    }

    async unactiveUser(infor={}) {
        let userInfor = await ModelCustomerCare.findOne({email: {$eq: infor.userEmail}});

        if(userInfor.current_care) {
            let userCare = await this.findUserCareByEmail(userInfor.current_care);
            userCare.current_care = ''
            await userCare.save();
        }

        if(userInfor) {
            userInfor.status = false;
            userInfor.socket_id = ''
            userInfor.status_new_message = false;
            userInfor.current_care = "";
            await userInfor.save();
        }

        return await ModelCustomerCare
        .find({status: {$eq: true}})
        .populate([
            {
                path: 'user',
                populate: [{
                    path: 'role'
                }]
            }
        ])
        .lean();
    }

    async saveMessageClient(infor={}) {
        let userInfor = await ModelCustomerCare.findOne({email: {$eq: infor.userEmail}});
        if(userInfor) {
            let payload = {
                content: infor.message,
            }

            userInfor.message.push(payload);
            await userInfor.save();
        }

        let user = await ModelCustomerCare.findOne({email: {$eq: infor.userEmail}});
        let admin = user.current_care? await this.findAdminByEmail(user.current_care) : null;
        return {user, admin};
    }

    async adminChooseClientSupport(infor={}) {
        let adminSupport = await this.findAdminById(infor.adminId);
        let clientNeedSupport = await this.findClientByEmail(infor.clientEmail);

        adminSupport.current_care = infor.clientEmail;
        if(adminSupport?.email) {
            clientNeedSupport.current_care = adminSupport?.email??'Test@gmail.com';
        }

        await adminSupport.save();
        await clientNeedSupport.save();

        return {admin: adminSupport, client: clientNeedSupport};
    }

    async saveMessageAdminSendToClient(infor={}) {
        let client = await this.findClientByEmail(infor.client.email);
        let payload = {
            content: infor.message,
            type: "Admin"
        }

        client.message.push(payload);
        await client.save();
        return await this.findClientByEmail(infor.client.email);
    }
}

module.exports = new ServiceCustomerCare();