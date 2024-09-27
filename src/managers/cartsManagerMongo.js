import {cartModel} from '../models/cartModel.js'
import { productModel } from '../models/productModel.js'

export class CartsManager {
    constructor() {
        this.model = cartModel
        this.modelP = productModel
    }

    async getcartById(id) {
        return this.model.findById(id)
    }

    async getCart(id){
        const cart = await this.getcartById(id);
        if (!cart) return 'El carrito no existe'
        let aux =  await this.model.findOne({_id: id}).populate('products.id') // ver si hacer un milware
        return aux
    }

    async addcart() {
        try {
            const respuesta = await this.model.create({ products: [] })
            return respuesta
        } catch (error) {
            throw error
        }
    }

    async addToCart(cid, pid) {
        const cart = await this.getcartById(cid);
        if (!cart) return 'El carrito no existe'
        const productIndex = cart.products.findIndex(producto => producto.id.equals(pid))
        if (productIndex !== -1) cart.products[productIndex].quantity++
        else cart.products.push({ id: pid, quantity: 1 })
        await this.model.updateOne({ _id: cid }, cart);
        return cart.products;
    }

    async updateCart(cid, products) {
        const cart = await this.getcartById(cid)
        if (!cart) return 'carrito no existe'
        await this.model.updateOne({ _id: cid }, { $set: { "products": products } })
        return "se actualizo el carrito"
    }

    async deleteProductCart(cid, pid) {
        const cart = await this.getcartById(cid)
        if (!cart) return 'carrito no existe'
        const productIndex = cart.products.findIndex(producto => producto.id.equals(pid))
        if (productIndex !== -1) cart.products.splice(productIndex, 1)
        await this.model.updateOne({ _id: cid }, cart)
        return "se elimino el producto"
    }

    async deleteCart(cid) {
        const cart = await this.getcartById(cid)
        if (!cart) return 'carrito no existe'  // alternativa a tener que escribit siempre las lineas de codigo ?
        await this.model.updateOne({ _id: cid }, { $set: { "products": [] } })
        return "se vacio el carrito"
    }
    async updateCartProduct(body){
        const cart = await this.getcartById(body.cid);
        if (!cart) return 'El carrito no existe'
        const productIndex = cart.products.findIndex(producto => producto.id.equals(body.pid))
        if (productIndex !== -1) cart.products[productIndex].body.quantity
        else cart.products.push({ id: body.pid, quantity: body.quantity })
        await this.model.updateOne({ _id: body.cid }, cart);
        return cart.products;
    }
}