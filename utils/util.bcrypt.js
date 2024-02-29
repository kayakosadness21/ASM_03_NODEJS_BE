"use strict"
const bcrypt = require("bcryptjs");


class UtilBcrypt {
    salt = 10;

    constructor() { }

    hash(password) {
        return bcrypt.hashSync(password, this.salt);
    }

    compare(password, passwordBcrypt) {
        return bcrypt.compareSync(password, passwordBcrypt);
    }
}

module.exports = new UtilBcrypt();