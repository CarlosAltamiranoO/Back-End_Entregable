const formCargarProductos = document.querySelector('#formCargarProductos')
const formBorrarProducto = document.querySelector('#formBorrarProducto')
const formModificarProducto = document.querySelector('#formModificarProducto')
const formCrearCarrito = document.querySelector('#formCrearCarrito')
const formCargarCarrito = document.querySelector('#formCargarCarrito')


if (formCargarProductos instanceof HTMLElement) {
    formCargarProductos.addEventListener('submit', event => {
        event.preventDefault()
        const formData = new FormData(formCargarProductos)
        const data = {}
        formData.forEach((value, key) => (data[key] = value))

        fetch('/api/products', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        })
        location.reload()
    })
}
if (formBorrarProducto instanceof HTMLElement) {
    formBorrarProducto.addEventListener('submit', event => {
        event.preventDefault()
        const data = document.getElementById("input_idErase").value;
        fetch(`/api/products/${data}`, { method: 'delete' })
            .then((res) => { if (res.ok) { location.reload() } else { console.log("ah ocurrido un error") } })
    })
}
if (formModificarProducto instanceof HTMLElement) {
    formModificarProducto.addEventListener('submit', event => {
        event.preventDefault()
        const variable = document.getElementById("select").value;
        const valor = document.getElementById("input_Modificar").value;
        const id = document.getElementById("input_idModificar").value;
        const data = {
            [variable]: valor,
        }
        fetch(`/api/products/${id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json"
            }
        }) .then((res) => { if(res.ok) {location.reload()} else{console.log("ah ocurrido un error")} })
    })
}
if (formCrearCarrito instanceof HTMLElement) {
    formCrearCarrito.addEventListener('submit', async event => {
        event.preventDefault()
        const res = await fetch('/api/carts', { method: 'post' })
        const user = await res.json()
        document.getElementById('resCarrito').innerHTML = `se creo el carrito id: ${user}`
    })
}
if (formCargarCarrito instanceof HTMLElement) {
    formCargarCarrito.addEventListener('submit', async event => {
        event.preventDefault()
        const datos = new FormData(formCargarCarrito)
        const cid = datos.get('idCargarCarrito')//document.getElementById("input_idCargarCarrito").value
        const pid = datos.get('idCargarProducto')//document.getElementById("input_idCargarProducto").value
        const res = await fetch(`/api/carts/${cid}/product/${pid}`, { method: 'post' })
        const respuesta = await res.json()
        document.getElementById('resBCarrito').innerHTML = `${respuesta}`
    })
}