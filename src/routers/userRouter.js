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
    const {firstname, lastname, age, email, rol, pass} = req.body; 

    try {
        //Verificamos si ya existe el usuario. 

        if (await manager.getUserByEmail(email)) {
            return res.status(400).send("El usuario ya existe en nuestra base de datos"); 
        }

        //Si no existe, lo puedo crear: 
        const password = createHash(pass)
        const carrito = await managerC.addcart()
        const cart = carrito._id

        const nuevoUsuario = await manager.addUser({firstname, lastname, age, email, password, cart, rol })

        //Generar el Token JWT
        const token = jwt.sign({usuario: nuevoUsuario.first_name}, "coderhouse", {expiresIn: "1h"}); 

        //Lo mandamos con la cookie. 

        res.cookie("userCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        })

        res.redirect("/api/sessions/current"); 

    } catch (error) {
        console.log(error)
        res.status(500).send("Error interno del servidor"); 
    }
})
userRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        //Buscamos al usuario en MongoDB: 
        const usuarioEncontrado = await manager.getUserByEmail(email); 

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

        res.cookie("userCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        })

        res.redirect("/api/sessions/current"); 
    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})
//Logout
userRouter.post("/logout", (req, res) => {
    res.clearCookie("userCookieToken"); 
    res.redirect("/login"); 
}) 

userRouter.get("/current", passport.authenticate("current", {session: false}), (req, res) => {
    console.log(req.user.usuario)
    res.render("home2", {
        pageTitle: "PRUEBA",
        labelTitle: "logeado",
        usuario: req.user.first_name
    });
})
