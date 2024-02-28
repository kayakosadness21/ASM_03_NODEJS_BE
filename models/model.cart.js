"use strict"
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionName = "carts";

const ModelCart = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    collections: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]

}, {
    timestamps: true,
    collection: collectionName
})

module.exports = mongoose.model(collectionName, ModelCart);