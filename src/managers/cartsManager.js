import { randomUUID } from 'crypto';
import fs from 'fs';

export default class cartsManager {
    constructor(path) {
        this.path = path
        this.carts = []
    }

    async #salveCarts() { // metodo privado para guardar carts en archivo
        try {
            const json = JSON.stringify(this.carts, null, '\t')
            await fs.promises.writeFile(this.path, json)
            
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async #getCarts() { // metodo privado para cargar this.carts con lo el del archivo
        try {
            const json = await fs.promises.readFile(this.path, 'utf-8')
            if (json === "") return true
            this.carts = JSON.parse(json)
            return false
        } catch (error) {
            console.error(error)
        }
    }

    async getcartById(id) { // metodo para obtener el un carrito por el id
        try {
            await this.#getCarts()
            const cart = this.carts.find(((cart) => cart.id === id))
            if (cart === undefined) return "no existe el carrito solicitado"
            return cart // se prodria hacer un metodo con bucle que utilise findProductbyId para cada elemnto del array, instanciando el productManager aca o en router
        } catch (error) {
            console.error(error)
        }

    }
    async addcart() { // metodo para guardar un carrito al archivo
        try {
            await this.#getCarts()
            const newCart = { id: randomUUID(), products: [] }
            this.carts.push(newCart)
            if (await this.#salveCarts()) return   `se creo el carrito ID: ${newCart.id}`
            else return " hubo un error al crear el carrito"

        } catch (error) {
            console.log(error)
        }
    }
    async addToCart(cid, pid) { // metodo para guardar un producto al archivo
        if (await this.#getCarts()) return "no hay ningun carrito cargado"
        const carrito = await this.getcartById(cid)
        if (carrito === "no existe el carrito solicitado") return "no existe el carrito solicitado" // ver si hay una mejor manera
        const indexCart = this.carts.findIndex(c => c.id === cid)
        const existingProduct = carrito.products.find(product => product.id === pid) // corrovora si ya existe el producto en el carrito
        if (existingProduct) existingProduct.quantity += 1
        else carrito.products.push({ id: pid, quantity: 1 })
        this.carts[indexCart] = carrito;
        await this.#salveCarts()
        return "se actualizo el carrito"
    }
}