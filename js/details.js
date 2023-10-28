document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        const detailsContainer = document.getElementById('details-container');
        const detailsUrl = `../js/details.json`; // Ruta al archivo details.json

        fetch(detailsUrl)
            .then(response => response.json())
            .then(data => {
                const producto = data.find(item => item.id === id);

                if (producto) {
                    const detailsHTML = `
                    <div class="swiper-container">
                      <div class="swiper-wrapper">
                        ${producto.imagenes_slider.slice(0, 3).map(imagen => `
                          <div class="swiper-slide">
                            <img class="producto-imagen-slider"width:100px height:200px src="${imagen}" alt="${producto.titulo}">
                          </div>
                        `).join('')}
                      </div>
                      <div class="swiper-pagination"></div>
                      <div class="swiper-button-next"></div>
                      <div class="swiper-button-prev"></div>
                    </div>
                    <div class="producto-img">
                    <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.descripcion}</p>
                    <p class="p-price">Price: ${producto.price}</p></div>`;

                    detailsContainer.innerHTML = detailsHTML;

                    // empieza Swiper con el efecto "fade"
                    const swiper = new Swiper('.swiper-container', {
                        effect: 'fade',
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                    });
                } else {
                    detailsContainer.innerHTML = "<p>Producto no encontrado</p>";
                }
            })
            .catch(error => console.error('Error:', error));
    }
});


