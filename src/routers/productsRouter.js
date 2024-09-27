import { Router } from "express"
/* import ProductsManager from "../managers/productsManager.js" */
import { ProductsManager } from '../managers/productsManagerMongo.js'

export const productsRouter = Router()
/* const manager = new ProductsManager('./src/data/Products.json') */
const manager = new ProductsManager()

/* productsRouter.get('/', async (req, res) => { 
    const limit = req.query.limit || null
    if (!limit) return res.send(await manager.getProducts())
    let respuesta = await manager.getProducts()
    respuesta = respuesta.slice(0, parseInt(limit))
    return res.json(respuesta)
}) */
productsRouter.get('/', async (req, res) =>{
    const page = req.query.page || 1
    const limit = req.query.limit || 5
    const params = { limit, page } || null
    const sort = req.query.sort
    let query = ""
    if (req.query.sort) { params.sort = { price: parseInt(sort) } }
    if (req.query.query) { query = { category: req.query.query } }
    const productos = await manager.getProducts({ params, query })
    const url = 'http://localhost:8080/'
    productos.prevLink = productos.hasPrevPage?`${url}?page=${productos.prevPage}` : '';
    productos.nextLink = productos.hasNextPage?`${url}?page=${productos.nextPage}` : '';
    productos.isValid = !(page <= 0 || page >= productos.totalPages)
    res.json(productos)
})

productsRouter.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)
    const respuesta = await manager.getProductById(productId)
    return res.json(respuesta)
})

productsRouter.post('/', async (req, res) => {
    try {
        req.body.status === "true"? req.body.status = true : req.body.status = false
        const producto = req.body
        const respuesta = await manager.addProduct(producto)
        res.send(respuesta)
    } catch (error) {
        return console.log(error)
    }
})

productsRouter.put('/:pid', async (req, res) => { 
    try {
        const { pid } = req.params
        const producto = req.body
        const respuesta = await manager.updateProduct(parseInt(pid), producto)
        res.json(respuesta)
    } catch (error) {
        console.log(error)
        res.send('el producto no existe')
    }
})
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const respuesta = await manager.deleteProduct(pid)
        res.send(JSON.stringify(respuesta))

    } catch (error) {
        return console.log(error)

    }

})