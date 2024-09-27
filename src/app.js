import express from "express";
import { productsRouter } from "./routers/productsRouter.js";
import { cartsRouter } from "./routers/cartsRouter.js";
import { viewsRouter } from "./routers/viewsRouter.js";
import { userRouter } from "./routers/userRouter.js";
import ProductsManager from "./managers/productsManager.js";
import {Server} from 'socket.io';
import Handlebars from "express-handlebars";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport  from "./config/passport.config.js";


const manager = new ProductsManager('./src/data/Products.json')
const app = express()
const PORT = 8080
const conection = 'mongodb+srv://carloscbautn:1234@cluster0.98dxrol.mongodb.net/e-comerce?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(conection)
    .then(() => console.log('conectado a la base'))
    .catch((error) => console.log('error: ', error))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

app.engine('handlebars', Handlebars.engine())
app.set('views', `./src/views`)
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/sessions", userRouter); 
app.use("/", viewsRouter)

const httpServer = app.listen(PORT, () => { console.log(`server running on PORT: ${PORT}`) })
const socketServer = new Server(httpServer)
socketServer.on('connection', async socket => {

    console.log(`nuevo cliente conectado! socket id #${socket.id}`)
    socketServer.sockets.emit('actualizarProductos', await manager.getProducts())

    socket.on('nuevoproducto', async producto => {
        const mg = await manager.addProduct(producto)
        socketServer.sockets.emit('error', mg)

        socketServer.sockets.emit('actualizarProductos', await manager.getProducts())
    })

    socket.on('borrado', async identificador => {

        if (identificador) {
            try {
                const mg = await manager.deleteProduct(parseInt(identificador))
                if (mg === "no hay producto a eliminar") socketServer.sockets.emit('error', "no hay producto a eliminar")
            }
            catch (error) {
                socketServer.sockets.emit('error', error.message)
            }
            socketServer.sockets.emit('actualizarProductos', await manager.getProducts())
        }
    })
})