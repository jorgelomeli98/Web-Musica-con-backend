const YOUTUBE_SEARCH_URL = "https://www.youtube.com/results?search_query=";


async function obtenerArtistaAleatorio() {
    try {
        const response = await fetch('https://web-musica-aleatoria.onrender.com/artista-aleatorio'); //127.0.0.1:8000 para pruebas locales
        const data = await response.json();
        
        if (data.artista) {
            return data.artista;
        } else {
            console.error("No se pudo obtener un artista aleatorio");
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el artista aleatorio:", error);
        return null;
    }
}


async function obtenerCancionDeArtista(artista) {
    try {
        const response = await fetch(`https://web-musica-aleatoria.onrender.com/canciones/${artista}`); //127.0.0.1:8000 para pruebas locales
        const data = await response.json();

        if (data.canciones && data.canciones.length > 0) {
            return data.canciones[0];
        } else {
            console.error(`No se encontraron canciones para el artista: ${artista}`);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener las canciones de ${artista}:`, error);
        return null;
    }
}

document.getElementById('load-music').addEventListener('click', async () => {
    const artista = await obtenerArtistaAleatorio();
    if (!artista) return;

    const cancion = await obtenerCancionDeArtista(artista);
    if (!cancion) return;

    console.log(`Buscando en YouTube: ${cancion}`);

    
    window.open(`${YOUTUBE_SEARCH_URL}${encodeURIComponent(cancion)}`, '_blank');
});
