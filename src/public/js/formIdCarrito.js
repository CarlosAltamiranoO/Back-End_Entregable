const eliminarBotones = document.querySelectorAll('.eliminarProducto');
const vaciarCarritoButton = document.querySelector('.vaciarCarrito');

eliminarBotones.forEach(function (boton) {

    boton.addEventListener('click', async () => {
        try {
            const cartId = document.getElementById("prueba").textContent;
            const productId = boton.getAttribute('data-product-id');
            //console.log('Eliminar producto del carrito:', cartId, 'ID del producto:', productId)
            const res = await fetch(`/api/carts/${cartId}/product/${productId}/`, { method: 'delete' })
            const respuesta = await res.json()
            //document.getElementById('resVCarrito').innerHTML = `${respuesta}`
            location.reload()
        } catch (error) {
            location.reload()
        }
    });
})

vaciarCarritoButton.addEventListener('click', async () => {
    try {
        const cartId = document.getElementById("prueba").textContent;
        const res = await fetch(`/api/carts/${cartId}`, { method: 'delete' })
        //console.log(cartId);
        const respuesta = await res.json()
        //document.getElementById('resVCarrito').innerHTML = `${respuesta}`
        location.reload()
    } catch (error) {
        location.reload()
    }
})