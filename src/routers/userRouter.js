import { Router } from "express"
import { UserManager } from "../managers/userManagerMongo.js"
import jwt from "jsonwebtoken"; 
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";
import { CartsManager } from "../managers/cartsManagerMongo.js";

export const userRouter = Router()
const manager = new UserManager()
const managerC = new CartsManager()

userRouter.post("/register", async (req, res) => {
    const {firtname, lastname, age, email, rol, password} = req.body; 

    try {
        //Verificamos si ya existe el usuario. 

        if (await manager.getCartById(email)) {
            return res.status(400).send("El usuario ya existe en nuestra base de datos"); 
        }

        //Si no existe, lo puedo crear: 
        password = createHash(password)
        const cart = await managerC.addcart()

        const nuevoUsuario = await manager.addUser({firtname, lastname, age, email, password, cart, rol })

        //Generar el Token JWT
        const token = jwt.sign({usuario: nuevoUsuario.first_name}, "coderhouse", {expiresIn: "1h"}); 

        //Lo mandamos con la cookie. 

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        })

        res.redirect("/api/sessions/current"); 

    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})
router.post("/login", async (req, res) => {
    const {email, password} = req.body; 

    try {
        //Buscamos al usuario en MongoDB: 
        const usuarioEncontrado = await manager.getCartById(email); 

        //Si no lo encuentro, lo puedo mandar a registrarse: 
        if (!usuarioEncontrado) {
            return res.status(400).send("Usuario no registrado, date una vuelta por el registro"); 
        }

        //Verificamos la contraseña: 
        if(!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta"); 
        }

        //Generamos el token JWT: 
        
        const token = jwt.sign({usuario: usuarioEncontrado.first_name, rol: usuarioEncontrado.rol}, "coderhouse", {expiresIn: "1h"});

        //Enviamos con la cookie: 

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        })

        res.redirect("/api/sessions/current"); 
    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})
