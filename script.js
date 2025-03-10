const YOUTUBE_SEARCH_URL = "https://www.youtube.com/results?search_query=";


async function obtenerArtistaAleatorio() {
    try {
        const response = await fetch('https://web-musica-aleatoria.onrender.com/artista-aleatorio');
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
        const response = await fetch(`https://web-musica-aleatoria.onrender.com/canciones/${artista}`);
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

    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const searchQuery = encodeURIComponent(cancion);

    if (isMobile) {
        
        window.location.href = `youtube://www.youtube.com/results?search_query=${searchQuery}`;
        
        
        setTimeout(() => {
            window.open(`${YOUTUBE_SEARCH_URL}${searchQuery}`, '_blank');
        }, 500);
    } else {
        
        window.open(`${YOUTUBE_SEARCH_URL}${searchQuery}`, '_blank');
    }
});
