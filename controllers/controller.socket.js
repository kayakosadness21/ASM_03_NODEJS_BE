"use Strict"
const ServiceCustomerCare = require("../services/service.customer_care");

class ControllerSocket {

    constructor() { }


    async adminOnline(socket) {
        socket.on('ADMIN-SIGNIN', async(data) => {
            let { id, email } = data;
            let list = await ServiceCustomerCare.activeUser({userId: id, userEmail: email, socketId: socket.id})
            console.log(list);
        })
    }

    async adminOffline(socket) {
        socket.on("ADMIN-SIGNOUT", async(data) => {
            let { email } = data;
            await ServiceCustomerCare.unactiveUser({userEmail: email});
        })
    }
}

module.exports = new ControllerSocket();