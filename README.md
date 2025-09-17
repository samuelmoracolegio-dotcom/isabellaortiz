# Carta Romántica para Isabella 💌

Una experiencia web elegante con sobre animado y álbum de fotos personalizado.

## Características

- **Sobre elegante**: Diseño inspirado en sobres reales con carta asomando
- **Álbum de fotos**: Navegación suave con texto superpuesto
- **Efectos visuales**: Corazones flotantes, destellos y animaciones
- **Reproducción automática**: Avance automático con controles manuales
- **Responsive**: Funciona perfectamente en móvil y desktop

## Cómo personalizar

### 1. Agregar tus fotos
Coloca tus imágenes en la carpeta `assets/` con estos nombres:
- `photo1.jpg`
- `photo2.jpg` 
- `photo3.jpg`
- `photo4.jpg`

### 2. Cambiar los textos
Edita el archivo `script.js` y modifica el array `captions`:

```javascript
captions: [
    "Tu texto personalizado para la foto 1",
    "Tu texto personalizado para la foto 2", 
    "Tu texto personalizado para la foto 3",
    "Tu texto personalizado para la foto 4"
]
```

### 3. Agregar más fotos
Si quieres más de 4 fotos:
1. Agrega las imágenes a `assets/`
2. Actualiza los arrays `photos` y `captions` en `script.js`
3. Añade más elementos `.dot` en el HTML

## Controles

- **Click en el sobre**: Abre y muestra el álbum
- **Botones de navegación**: Anterior/Siguiente
- **Botón de reproducción**: Inicia/pausa el avance automático
- **Puntos indicadores**: Click para ir a una foto específica
- **Teclado**: Flechas izquierda/derecha y espacio

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings → Pages
4. Selecciona "Deploy from a branch" → "main"
5. Tu sitio estará en: `https://tu-usuario.github.io/nombre-repo`

## Estructura de archivos

```
├── index.html          # Estructura principal
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica y datos
├── assets/             # Carpeta para tus fotos
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   └── photo4.jpg
└── README.md           # Este archivo
```

¡Hecho con ❤️ para Isabella!


