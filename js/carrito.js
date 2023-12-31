//tomo los productos del cart del almacenamiento local(localStorage)
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

//selecciono elementos del DOM que se usarán
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

//función p/cargar productos en el cart
function cargarProductosCarrito() {
    //verifico si hay productos en el cart
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        
        //// si hay productos se ajustan las clases de los contenedores
        contenedorCarritoVacio.classList.add("disabled"); //desactivado
        contenedorCarritoProductos.classList.remove("disabled"); //desactivado
        contenedorCarritoAcciones.classList.remove("disabled"); //desactivado
        contenedorCarritoComprado.classList.add("disabled"); //desactivado
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("producto"); // Agrego la clase "producto"

            const titulo = document.createElement("h3");
            titulo.textContent = producto.titulo;
            titulo.classList.add("item"); // Agrega la clase "item"

            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Qualification</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Amount</small>
                    <p>${producto.cantidad}</p>
                </div>
                
                <div class="carrito-producto-precio">
                    <small>Price</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;


            div.appendChild(titulo);
            // Agrega otros elementos
    
            contenedorCarritoProductos.append(div);
        })
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Removed Product",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, gray, cyan)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿You are sure?',
        icon: 'question',
        html: `They are going to be deleted ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} products.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");

}

// función p/ comprar los productos en el carrito
function comprarCarrito() {
    /* muestro una ventana p/confirmar la compra con sweetAlert */
    Swal.fire({
        title: 'Confirm Purchase',
        text: 'Are you sure you want to make this purchase?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Purchase',
        cancelButtonText: 'Cancel'
    }).then((result) => {  // se escucha el resultado de la ventana de confirmación */
        if (result.isConfirmed) { //si el usuario confirma la compra
            // simulo pago asincrónico
            simuloPagoAsincronico() //llamo a la función p/ simular pago
                .then(() => { //si el pago es exitoso
                    productosEnCarrito.length = 0; //se vacía el carrito
                    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); //se actualiza el localStorage


                ///ajusto las clases p/ mostrar 1 mensaje de compra hecha
                    contenedorCarritoVacio.classList.remove("disabled");
                    contenedorCarritoProductos.classList.add("disabled");
                    contenedorCarritoAcciones.classList.add("disabled");
                    contenedorCarritoComprado.classList.remove("disabled");

                    Swal.fire({  //muestro la compra exitosa con sweet Alert
                        title: 'Purchase Successful',
                        icon: 'success',
                        text: 'Thank you for your purchase!',
                    });
                })
                .catch(() => { //si el pago no se hace
                    Swal.fire({  //muestro con sweet Alert el pago erróneo
                        title: 'Payment Failed',
                        icon: 'error',
                        text: 'There was an error processing your payment. Please try again later.',
                    });
                });
        }
    });
}

// función p/ simular pago asincrónico
function simuloPagoAsincronico() {
    return new Promise((resolve, reject) => {  //// devuelve una promesa p/ simular el pago
        // simulo un tiempo de 2 seg p/ el pago
        setTimeout(() => {
            const pagoExitoso = Math.random() < 0.8; // simulo un 80% de éxito en el pago
            if (pagoExitoso) { //si se da el pago
                resolve();   //resuelve la promesa
            } else {   //si el pago falla
                reject();  //rechaza la promesa
            }
        }, 2000); // simulo un tiempo de 2 segundos.
    });
}

