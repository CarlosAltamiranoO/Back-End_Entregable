import  { model, Schema } from 'mongoose'

const cartSchema = Schema({
    products: {
        type: [{ id: { type: Schema.Types.ObjectId, ref: 'products'}, quantity: Number }]
    }
}, { versionKey: false });

export const cartModel = model('carts', cartSchema);