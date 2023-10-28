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
                <a href="../pages/details.html?id=${producto.id}" class="seeMore btn" id="seeMore${producto.id}">See More</a>
            </div>
        `;
        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar(); // Se actualizan los botones 'agregar'
}

//se itera sobre c/ btn de categorías 
botonesCategorias.forEach(boton => {
    // agrego un evento que escucha el evento 'click' a c/btn
    boton.addEventListener("click", (e) => {

        // se remueve la clase 'active' de todos los btn de categorías
        botonesCategorias.forEach(boton => boton.classList.remove("active"));

        // agrego la clase 'active' al btn que fue clickeado
        e.currentTarget.classList.add("active");

        // verifico si el btn clickeado no tiene el ID "todos"
        if (e.currentTarget.id != "todos") {
            // encuentro el producto correspondiente a la categoría del btn clickeado
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            
            // cambio el texto del título principal x el nombre de la categoría elegida
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;

            // filtro los productos de la categoría elegida
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);

            // cargo los productos de la categoría elegida
            cargarProductos(productosBoton);
        } else {
            // si se clickea el btn "todos" se muestra todos los productos
            tituloPrincipal.innerText = "Browse all products";
            cargarProductos(productos);
        }
    })
});


// Evento para actualizar los btn de agregar
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
    // Acá se muestra la notificación de la librería Toastify
    Toastify({
        text: "Added Product",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, cyan , grey)",
          borderRadius: "20px",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '100px' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

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






