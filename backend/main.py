import os
from dotenv import load_dotenv
import httpx
from fastapi import FastAPI
import random

app = FastAPI()

load_dotenv()

API_KEY = os.getenv("LASTFM_API_KEY")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

generos = [
    'rock', 'pop', 'hip-hop', 'jazz', 'electronic', 'indie', 'classical', 'reggae', 'metal', 'blues', 'experimental', 'psychedelic', 
    'progressive metal', 'latin', 'math rock', 'shoegaze', 'avant-garde', 'progressive', 'post rock', 'all', 'funk', 'poptron', 'alternative', 'mexico', 'soca', 'salsa', 
    'romo', 'ska', 'rave', 'spanish'
]

def obtener_genero_aleatorio():
    return random.choice(generos)

async def obtener_artista_aleatorio():
    print(API_KEY)
    genero = obtener_genero_aleatorio()
    url = f"https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag={genero}&api_key={API_KEY}&format=json&limit=350"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    
    if "topartists" in data and "artist" in data["topartists"]:
        artista_aleatorio = data["topartists"]["artist"][random.randint(0, 350)]
        return artista_aleatorio['name']
    return None

async def obtener_canciones_de_artista(artista):
    url = f"https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist={artista}&api_key={API_KEY}&format=json&limit=5"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()

    if "toptracks" in data:
        canciones = data["toptracks"]["track"]
        return [cancion["name"] for cancion in canciones]
    return None

@app.get("/artista-aleatorio")
async def get_artista_aleatorio():
    artista = await obtener_artista_aleatorio()
    if artista:
        return {"artista": artista}
    return {"error": "No se pudo obtener un artista aleatorio"}

@app.get("/canciones/{artista}")
async def get_canciones(artista: str):
    canciones = await obtener_canciones_de_artista(artista)
    if canciones:
        return {"artista": artista, "canciones": canciones}
    return {"error": "No se encontraron canciones para este artista"}