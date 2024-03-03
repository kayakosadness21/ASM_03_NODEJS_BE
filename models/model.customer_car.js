"use strict"

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const COLLECTION_NAME = 'customers_care';

const ModelCustomerCare = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        default: ''
    },
    socket_id: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: false
    },
    status_new_message: {
        type: Boolean,
        default: false
    },
    current_care: {
        type: String,
        default: ''
    },
    message: [
        {
            createDate: {
                type: Date,
                default: Date.now
            },
            content: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'Client'
            },
            care: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]

}, {
    collection: COLLECTION_NAME
})


module.exports = mongoose.model(COLLECTION_NAME, ModelCustomerCare);