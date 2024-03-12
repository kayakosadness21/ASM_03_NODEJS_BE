"use strict"
const NodeMailer = require("nodemailer");

class UtilMailer {
    async send(email, template, cb) {
        
        let transporter = NodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'quandang2104@gmail.com',
                pass: 'yuyn jape cqeo bdlz'
            }
        })

        var mailOption = {
            from: 'quandang2104@gmail.com',
            to: email,
            subject: 'GD WEB BÁN HÀNG',
            html: template
        }

        transporter.sendMail(mailOption, (error, info) => {
            if(error) cb({status: false, infor: error});
            cb({status: true, infor: info});
        })
    }
}

module.exports = new UtilMailer();