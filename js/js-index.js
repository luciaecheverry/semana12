document.addEventListener("DOMContentLoaded", async function () {
    const url = 'https://japceibal.github.io/japflix_api/movies-data.json'; 
    let peliculas = [];
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar el archivo JSON');
      }
      peliculas = await response.json();
    } catch (error) {
      console.error('Error al cargar el archivo JSON:', error);
    }
  
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const listaResultados = document.getElementById('lista');
    const infoPelicula = document.getElementById('infoPelicula');
    const infoTitulo = document.getElementById('infoTitulo');
    const infoOverview = document.getElementById('infoOverview');
    const infoGeneros = document.getElementById('infoGeneros');
    const btnDetalles = document.getElementById('btnDetalles');
    const detallesPelicula = document.getElementById('detallesPelicula');
  
    // Función para mostrar la información de la película seleccionada
    function mostrarInfoPelicula(pelicula) {
      infoTitulo.textContent = pelicula.title;
      infoOverview.textContent = pelicula.overview;
  
      // Limpiar la lista de géneros y rellenarla con los géneros de la película
      infoGeneros.innerHTML = '';
      pelicula.genres.forEach(genre => {
        const li = document.createElement('li');
        li.textContent = genre.name; // Cambiar a genre.name para acceder al nombre
        li.classList.add('list-inline-item'); // Añadir clase para mostrar en línea
        infoGeneros.appendChild(li);
      });
  
      // Mostrar detalles adicionales
      document.getElementById('infoAño').textContent = pelicula.release_date.split('-')[0]; // Año
      document.getElementById('infoDuracion').textContent = pelicula.runtime; // Duración
      document.getElementById('infoPresupuesto').textContent = pelicula.budget; // Presupuesto
      document.getElementById('infoGanancias').textContent = pelicula.revenue; // Ganancias
  
      // Agregar evento al botón "Mostrar detalles"
      btnDetalles.addEventListener('click', () => {
        detallesPelicula.style.display = detallesPelicula.style.display === 'none' ? 'block' : 'none'; // Alterna la visibilidad del contenedor
      });
  
      // Asegurarnos de que el contenedor de información esté visible
      infoPelicula.style.display = 'block';
      infoPelicula.classList.remove('d-none');
    }
  
    // Función para mostrar los resultados
    function mostrarResultados(resultados) {
      listaResultados.innerHTML = ''; 
  
      if (resultados.length === 0) {
        listaResultados.innerHTML = '<li class="list-group-item">No se encontraron resultados.</li>';
        return;
      }
  
      resultados.forEach(pelicula => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'bg-dark', 'text-white');
  
        const estrellas = Math.round(pelicula.vote_average / 2);
        let estrellasHTML = '';
  
        for (let i = 1; i <= 5; i++) {
          if (i <= estrellas) {
            estrellasHTML += '<i class="fa fa-star text-warning"></i>'; // Estrella llena
          } else {
            estrellasHTML += '<i class="fa fa-star-o text-muted"></i>'; // Estrella vacía
          }
        }
  
        li.innerHTML = `
          <h5>${pelicula.title}</h5>
          <p>${pelicula.tagline}</p>
          <p>${estrellasHTML} (${pelicula.vote_average}/10)</p>
        `;
  
        // Agregar un evento click para mostrar más detalles de la película
        li.addEventListener('click', () => {
          mostrarInfoPelicula(pelicula);
        });
  
        listaResultados.appendChild(li);
      });
    }
  
    btnBuscar.addEventListener('click', function () {
      const query = inputBuscar.value.toLowerCase().trim(); 
  
      if (query) {
        const resultados = peliculas.filter(pelicula => {
          const genresMatch = Array.isArray(pelicula.genres) && pelicula.genres.some(g => typeof g === 'object' && g.name.toLowerCase().includes(query));
          return (
            pelicula.title.toLowerCase().includes(query) ||
            genresMatch ||
            (pelicula.tagline && pelicula.tagline.toLowerCase().includes(query)) ||
            (pelicula.overview && pelicula.overview.toLowerCase().includes(query))
          );
        });
  
        mostrarResultados(resultados);
      } else {
        listaResultados.innerHTML = '<li class="list-group-item">Por favor, ingresa un término de búsqueda.</li>';
      }
    });
  });
  