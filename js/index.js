let productos = []; //Declaro una variable p/ almacenar los productos

//Pido tomar los productos del json: productos.json
fetch("./js/productos.json")
    .then(response => response.json()) // la respuesta se transforma a formato JSON
    .then(data => {
        productos = data; // a la variable 'productos' se le da un resultado
        cargarProductos(productos); //Los productos cargan en la pag
    })

//Tomo los elementos del DOM y declaro variables
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const number = document.querySelector("#number");

//Agrego un evento a los botones de categorías para ocultar el aside
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

// Función para cargar los productos en la página
function cargarProductos(productosElegidos) {
    // Limpia el contenedor de productos
    contenedorProductos.innerHTML = "";

    // Por cada producto, se crea un div con la info y se agrega al HTML
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Add</button>
                <button class="seeMore" id="seeMore${producto.id}">See More</button>
            </div>
        `;
        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar(); // Se actualizan los botones 'agregar'
}

// Evento para actualizar los botones de agregar
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumber();
} else {
    productosEnCarrito = [];
}

// Función para agregar un product al cart
function agregarAlCarrito(e) {
    // Aquí se muestra la notificación usando Toastify

    // Obtengo ID del producto
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumber(); //  el número en el carrito se actualiza

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para actualizar el número en el cart
function actualizarNumber() {
    let nuevoNumber = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    number.innerText = nuevoNumber;
}

/* See More */

// Una vez que todo el contenido de la pag carga
document.addEventListener('DOMContentLoaded', () => {
  
    // Selecciona los elementos con la clase 'seeMore' y los guarda en una lista
    const botonesSeeMore = document.querySelectorAll('.seeMore');
  
    // Por cada botón 'See More'
    botonesSeeMore.forEach(boton => {
      
      // Se hace un evento 'click' que se dispara al hacer click en el btn
      boton.addEventListener('click', (e) => {
        
        // toma el ID del producto del botón.
        const idProducto = e.target.dataset.id;
        
        //Se abriría (no se abre! jaja) details.html con el ID del producto
        window.open(`./pages/details.html?id=${idProducto}`);
      });
    });
});
