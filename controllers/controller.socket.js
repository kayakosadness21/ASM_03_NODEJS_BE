"use Strict"
const ServiceCustomerCare = require("../services/service.customer_care");

class ControllerSocket {

    constructor() { }

    async clientOnline(socket, io) {
        socket.on("CLIENT-SIGNIN", async(data) => {
            let { id, email } = data;
            let list = await ServiceCustomerCare.activeUser({userId: id, userEmail: email, socketId: socket.id})
            io.emit('LIST-USER-ONLINE', {list});
        })
    }

    async clientOffline(socket, io) {
        socket.on("CLIENT-SIGNOUT", async(data) => {
            let { email } = data;
            let list = await ServiceCustomerCare.unactiveUser({userEmail: email});
            io.emit('LIST-USER-ONLINE', {list});
        })
    }

    async clientSendMessage(socket, io) {
        socket.on("CLIENT-SEND-MESSAGE", async(data) => {
            let { email, message } = data;
            let clientInfor = await ServiceCustomerCare.saveMessageClient({userEmail: email, message});
            socket.emit("MESSAGE-OF-CLIENT-SEND", {clientInfor});
        })
    }

    async adminOnline(socket, io) {
        socket.on('ADMIN-SIGNIN', async(data) => {
            let { id, email } = data;
            let list = await ServiceCustomerCare.activeUser({userId: id, userEmail: email, socketId: socket.id})
            io.emit('LIST-USER-ONLINE', {list});
        })
    }

    async adminOffline(socket, io) {
        socket.on("ADMIN-SIGNOUT", async(data) => {
            let { email } = data;
            let list = await ServiceCustomerCare.unactiveUser({userEmail: email});
            io.emit('LIST-USER-ONLINE', {list});
        })
    }

    async adminChooseClientSupport(socket, io) {
        socket.on("ADMIN-CHOOSE-CLIENT-SUPPORT", async (data) => {
            let { id: adminId, email: clientEmail } = data;
            let infor = await ServiceCustomerCare.adminChooseClientSupport({adminId, clientEmail });

            socket.emit('CLIENT-ADMIN-CHOOSE', {client: infor.client});
        })
    }
}

module.exports = new ControllerSocket();