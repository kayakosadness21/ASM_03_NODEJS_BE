"use Strict"
const ServiceCustomerCare = require("../services/service.customer_care");

class ControllerSocket {

    constructor() { }

    // CLIENT ONLINE SIGNIN CHAT
    async clientOnline(socket, io) {
        socket.on("CLIENT-SIGNIN", async(data) => {
            let { id, email } = data;
            let list = await ServiceCustomerCare.activeUser({userId: id, userEmail: email, socketId: socket.id})
            io.emit('LIST-USER-ONLINE', {list});
        })
    }


    // CLIENT OFFLINE SIGNOUT CHAT
    async clientOffline(socket, io) {
        socket.on("CLIENT-SIGNOUT", async(data) => {
            let { email } = data;
            let list = await ServiceCustomerCare.unactiveUser({userEmail: email});
            io.emit('LIST-USER-ONLINE', {list});
        })
    }


    // CLIENT SEND MESSAGE TO ADMIN WAIT SUPPORT
    async clientSendMessage(socket, io) {
        socket.on("CLIENT-SEND-MESSAGE", async(data) => {
            let { email, message } = data;
            let {user, admin } = await ServiceCustomerCare.saveMessageClient({userEmail: email, message});
            socket.emit("MESSAGE-OF-CLIENT-SEND", {user});

            if(admin) {
                socket.broadcast.emit("CLIENT-SEND-MESSAGE-TO-ADMIN-SUPPORT", {user});
            }
        })
    }


    // ADMIN ONLINE SIGNIN CHAT
    async adminOnline(socket, io) {
        socket.on('ADMIN-SIGNIN', async(data) => {
            let { id, email } = data;
            let list = await ServiceCustomerCare.activeUser({userId: id, userEmail: email, socketId: socket.id})
            io.emit('LIST-USER-ONLINE', {list});
        })
    }


    // ADMIN OFFLINE SIGNOUT CHAT
    async adminOffline(socket, io) {
        socket.on("ADMIN-SIGNOUT", async(data) => {
            let { email } = data;
            let list = await ServiceCustomerCare.unactiveUser({userEmail: email});
            io.emit('LIST-USER-ONLINE', {list});
        })
    }


    // ADMIN CHOOSE CLIENT SUPPORT
    async adminChooseClientSupport(socket, io) {
        socket.on("ADMIN-CHOOSE-CLIENT-SUPPORT", async (data) => {
            let { id: adminId, email: clientEmail } = data;
            let infor = await ServiceCustomerCare.adminChooseClientSupport({adminId, clientEmail });
            let list = await ServiceCustomerCare.getListUserOnline()
            socket.emit('CLIENT-ADMIN-CHOOSE', {client: infor.client, list});
        })
    }

    // ADMIN SEND MESSAGE TO CLIENT
    async adminSendMessage(socket, io) {
        socket.on("ADMIN-SEND-MESSAGE-TO-CLIENT", async(data) => {
            let client = await ServiceCustomerCare.saveMessageAdminSendToClient({client: data.client, message: data.message});
            socket.emit("ADMIN-SEND-MESSAGE-TO-CLIENT-DONE", {client});
            socket.broadcast.emit("CLIENT-RECIVE-MESSAGE-FROMADMIN-SUPPORT", {client});
        })
    }
}

module.exports = new ControllerSocket();