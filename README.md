# Pokedex

Aplicación web tipo Pokédex desarrollada con React y Vite, con interfaz inspirada en las consolas clásicas y consumo de la PokeAPI.

## Características

- Búsqueda de Pokémon por nombre o ID.
- Navegación rápida con botones estilo consola.
- Visualización de descripción, evoluciones, tipos e información básica.
- Modo shiny para cambiar la apariencia del Pokémon actual.
- Reproducción de audio de la descripción cuando se configura una clave de VoiceRSS.

## Requisitos

- Node.js 18 o superior
- pnpm 9 o superior

## Variables de entorno

Copia [.env.example](.env.example) a .env y define:

- VITE_VOICE_API_KEY: clave de VoiceRSS
- VITE_VOICE_LANGUAGE: idioma para el TTS, por ejemplo es-mx o en-us

## Instalación

```bash
pnpm install
```

## Uso

```bash
pnpm dev
```

La aplicación quedará disponible en el puerto por defecto de Vite.

## Construcción para producción

```bash
pnpm build
```

## Despliegue

```bash
pnpm run deploy
```

> Este proyecto está configurado para trabajar exclusivamente con pnpm, por lo que se recomienda no usar npm para instalar ni ejecutar scripts.
