//import {Schema, model } from 'mongoose'
import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const productSchema = mongoose.Schema({
    code: {type:String, unique:true, index: true}, // ver cual es la caracteristica que debe ser indexada
    title: String,
    description: String,
    category: String,
    thumbnail: [String],
    stock: Number,
    price: Number,
    status: Boolean
}, {versionKey: false})
productSchema.plugin(paginate);
export const productModel = mongoose.model('products', productSchema);