"use strict"
const ModelCustomerCare = require("../models/model.customer_car");
const ServiceUser = require("./service.user");

class ServiceCustomerCare {
    
    constructor() { }

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
        if(userInfor) {
            userInfor.status = false;
            userInfor.socket_id = ''
            userInfor.status_new_message = false;
            userInfor.current_care = "";
            await userInfor.save();
        }
    }
}

module.exports = new ServiceCustomerCare();