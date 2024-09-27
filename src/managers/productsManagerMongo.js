import { productModel } from '../models/productModel.js';


export class ProductsManager {
    constructor() {
        this.model = productModel
    }

    async getProductById(id) {
        return this.model.findById(id).lean()
    }

    async getProducts(req) {

        if (!req.params) return await this.model.find(); /* para utilisar el websocket no se si hay otra forma  */

        let aux = await this.model.paginate(req.query, req.params)
        aux.docs = aux.docs.map(aux => aux.toObject())
        if (req.query) aux.category = req.query.category
        if (req.params.sort) aux.sort = req.params.sort.price
        return aux

    }

    async addProduct(body) {
        try {
            return this.model.create({
                code: body.code,
                title: body.title,
                description: body.description,
                category: body.category,
                thumbnail: body.thumbnail,
                stock: body.stock,
                price: body.price,
                status: body.status
            })
        } catch (error) {
            throw error
        }
    }

    async updateProduct(id, body) {
        const product = await this.getProductById(id)
        if (!product) {
            throw new Error('Producto no existe')
        }
        const productUpdated = {
            _id: product._id,
            code: body.code || product.code,
            title: body.title || product.title,
            description: body.description || product.description,
            thumbnail: body.thumbnail || product.thumbnail,
            price: body.price || product.price,
            stock: body.stock || product.stock,
            status: body.status !== undefined ? body.status : product.status
        }
        await this.model.updateOne({ _id: id }, productUpdated)
        return productUpdated
    }

    async deleteProduct(id) {
        const product = await this.model.findById(id) // ver si funciona
        if (!product) {
            return 'Producto no existe'
        }
        await this.model.deleteOne({ _id: id })
        return 'se elimino el producto'
    }
}