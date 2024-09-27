import userModel from "../models/user.model.js"
import manager from "./cartsManagerMongo.js"

export class UserManager {
    constructor() {
        this.model = userModel
    }
    async getUserByEmail(Email) {
        return this.model.findOne({ email: Email })
    }
    async getCartById(id) {
        return this.model.findById(id)
    }
    async addUser(body) {
        try {
            return this.model.create({
                first_name: body.firstname,
                last_name: body.lastname,
                email: body.email,
                age: body.age,
                password: body.password,
                rol: body.rol,
                cart: body.cart
            })

        } catch (error) {
            throw error
        }
    }
}