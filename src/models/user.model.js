import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type: String , unique: true},
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    rol: {
        type: String,
        enum: ["admin", "user"], 
        default: "user"
    }
},
{ versionKey: false })
const UserModel = mongoose.model("usuarios", userSchema); 

export default UserModel;