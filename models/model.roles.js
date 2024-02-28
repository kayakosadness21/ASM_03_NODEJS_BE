"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collectionName = "roles";

const ModelRole = new Schema({
    title: {
        type: String,
        default: "Client"
    },
    users: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
}, {
    collection: collectionName,
    timestamps: true
})


module.exports = mongoose.model(collectionName, ModelRole);