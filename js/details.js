// Una vez que se carga el DOM se ejecuta el código
document.addEventListener('DOMContentLoaded', () => {

    // Tomo el ID del producto de los parámetros de la URL
    const urlParametros = new URLSearchParams(window.location.search);
    const idProducto = urlParametros.get('id');

    // Pido tener los detalles del producto de 'details.json'
    fetch('./js/details.json')
        .then(response => response.json())
        .then(data => {
            // Encuentra el ID del producto
            const producto = data.find(item => item.id === idProducto);

            // se toma el contenedor de detalles del producto
            const detailsContainer = document.getElementById('product-details');

            // se completa el contenedor con la descripción del producto
            detailsContainer.innerHTML = `
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
                <!-- Falta agregar un carousel de imágenes descriptivas del producto -->
            `;
        });
});

  
