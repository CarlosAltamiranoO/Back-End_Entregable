import { Router } from "express"
/* import cartsManager from "../managers/cartsManager.js" */
import { CartsManager }  from '../managers/cartsManagerMongo.js'

export const cartsRouter = Router()
/* const Manager = new cartsManager('./src/data/Carts.json') */
const manager = new CartsManager()

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const respuesta = await manager.addToCart(cid, pid)
        res.json(JSON.stringify(respuesta))

    } catch (error) {
        console.log(error)
        res.send('Los datos ingresados son incorrectos')
    }

})

cartsRouter.post('/', async (req, res) => {
    const respuesta = await manager.addcart()
    res.json(JSON.stringify(respuesta.id))
})

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        let respuesta = await manager.getcartById(cartId)
        res.json(JSON.stringify(respuesta))
    } catch (error) {
        console.log(error)
        res.send('Los datos ingresados son incorrectos')
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        let respuesta = await manager.deleteCart(cartId)
        res.json(JSON.stringify(respuesta))
    } catch (error) {
        res.json('Los datos ingresados son incorrectos')
    }

})
cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        let respuesta = await manager.deleteProductCart(cartId, productId)
        res.json(JSON.stringify(respuesta))
    } catch (error) {
        res.json('Los datos ingresados son incorrectos')
    }
})

cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body
    let respuesta = await manager.updateCartProduct({cid: cartId, pid: productId, quantity: quantity})
    res.json(JSON.stringify(respuesta))

})