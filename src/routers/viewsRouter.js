import { Router } from "express"
/* import ProductsManager from "../managers/productsManager.js" */
import { ProductsManager} from '../managers/productsManagerMongo.js'
import { CartsManager } from "../managers/cartsManagerMongo.js"

export const viewsRouter = Router()
const manager = new ProductsManager()
const managerCart = new CartsManager()

viewsRouter.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        title: 'REAL TIME PRODUCT',
        labelTitle: 'Productos en tiempo real'
    })
})

/* viewsRouter.get("/", async (req, res) => {

    const productos = await manager.getProducts()

    res.render('home', {
        title: 'HOME',
        labelTitle: 'Productos',
        hayProductos: productos.length > 0,
        productos,
    })
}) */
viewsRouter.get('/', async (req, res) => {
    
    const page = req.query.page || 1
    const limit = req.query.limit || 5
    const params = { limit, page } || null
    const sort = req.query.sort
    let query = ""
    if (req.query.sort) { params.sort = { price: parseInt(sort) } }
    if (req.query.query) { query = { category: req.query.query } }
    const productos = await manager.getProducts({ params, query })
    /* ver como usar lo de nexlink */
    const url = 'http://localhost:8080/'
    productos.prevLink = productos.hasPrevPage?`${url}?page=${productos.prevPage}` : '';
    productos.nextLink = productos.hasNextPage?`${url}?page=${productos.nextPage}` : '';
    productos.isValid = !(page <= 0 || page >= productos.totalPages)
    /* ver como usar lo de nexlink */
    //console.log("productos: ", productos)
    res.render('home', {
        title: "HOME",
        labelTitle: "panel de productos",
        hayProductos: productos.docs.length > 0,
        productos,
    })
})
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        let respuesta = await managerCart.getCart(cartId)
        const productsCart = respuesta.products.map(aux => aux.toObject())
    
        res.render('carrito', {
            pageTitle: "productos del carrito",
            labelTitle: "Tu Carrito:",
            hayProductos: respuesta.products.length > 0,
            productsCart,
            cartId: cartId
        })
    } catch (error) {
        console.log(error)
        res.send('Los datos ingresados son incorrectos')
    }
})
viewsRouter.get("/register", (req, res) => {
    res.render("register", {
        pageTitle: "REGISTRO",
        labelTitle: "Registro",
    }); 
})

viewsRouter.get("/login", (req, res) => {
    res.render("login", {
        pageTitle: "LOGIN",
        labelTitle: "login",
    });
})