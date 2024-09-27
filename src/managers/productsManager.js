import fs from 'fs'


export default class ProductsManager {

    constructor(path) {
        this.path = path;
        this.products = [];
    }

    #addId() { // metodo privado para poder asignar un id al producto, entrega el id para el nuevo producto
        if (this.products.length === 0) return 1;
        return this.products.at(-1).id + 1; // metodo at, si colocas -1 accedes al ultimo elemento del array, al sumar id +1 ya tenes el id que debes colocar al nuevo producto
    }

    #findCode(code) { // metodo privado para encontrar producto con el codigo, true para que existe el producto y false para que el producto no existe
        let find = this.products.find(elem => elem.code === code)
        if (find === undefined) return false;
        else return true;
    }

    #findIndice(id) { // metodo privado para obtener el indice del producto con el id dado
        const indice = this.products.map(product => product.id).indexOf(id)
        return indice
    }

    async #salveProduct() { // metodo privado para guardar producto en archivo
        try {
            const json = JSON.stringify(this.products, null, '\t')
            await fs.promises.writeFile(this.path, json)
        } catch (Error) {
            console.log(Error)
        }
    }

    async getProducts() { // metodo para enviar el array de productos en archivo, tambien carga this.products con el arrray en archivo
        try {
            const json = await fs.promises.readFile(this.path, 'utf-8')
            if (json === "") return 'la lista esta vacia!!';
            this.products = JSON.parse(json);
            return this.products
        } catch (error) {
            console.log("Ha ocurrido un error!!!", error)
        }
    }

    async addProduct(product) { // metodo para agregar un producto 
        await this.getProducts();
        if(product.code === undefined || product.title === undefined || product.description === undefined || product.stock === undefined ) return "ingrese todos los datos sugeridos"
        if (this.#findCode(product.code)) return 'el codigo del producto ya se encuentra cargado!'
        //if (product.status === undefined || product.status === "") product.status = true;// nesesario ya que me manda un string en ves de booleano;
        product.status = !product.status
        product.thumbnail = product.thumbnail || [];
        const id = this.#addId();
        product = { id: id, ...product }

        this.products.push(product);
        this.#salveProduct();
        return 'se cargo el producto'
    }

    async getProductById(id) { // metodo para obtener producto por el id, no
        await this.getProducts();
        let product;
        product = this.products.find(elem => elem.id === id);
        if (product === undefined) return 'Not Found'
        return product
    }

    async updateProduct(id, product) { //metodo para actualizar producto  
        await this.getProducts();

        const indice = this.#findIndice(id)
        const producto = await this.getProductById(id)
        if (indice === -1) return "no hay producto a actualizar"

        const productUpdated = {
            id: producto.id,
            title: product.title || producto.title,
            description: product.description || producto.description,
            price: product.price || producto.price,
            thumbnail: product.thumbnail || producto.thumbnail,
            code: product.code || producto.code,
            stock: product.stock || producto.stock,
            status: product.status !== undefined ? product.status : producto.status // revisar si funciona en caso de false o toma false como undefined
        }

        this.products[indice] = productUpdated;
        await this.#salveProduct()
        return "Producto actualizado:"
    }

    async deleteProduct(id) { // metodo para eliminar el producto 
        await this.getProducts();
        const index = this.#findIndice(id)
        if (index === -1) return "no hay producto a eliminar"
        this.products.splice(index, 1)
        await this.#salveProduct()
        return "se elimino el producto"

    }

}