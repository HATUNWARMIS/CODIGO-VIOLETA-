# Código Violeta 💜

Prototipo web responsive en HTML, CSS y JavaScript para una ruta educativa de prevención de violencia, seguridad digital, comunicación asertiva y redes de apoyo.

## Ejecutar en Visual Studio Code

1. Descomprime la carpeta `Codigo_Violeta`.
2. Abre Visual Studio Code y selecciona **Archivo → Abrir carpeta**.
3. Abre `index.html` en el navegador, o instala la extensión **Live Server** y pulsa **Go Live**.
4. Para cambiar textos o colores, edita `index.html` y `css/styles.css`. Las interacciones están en `js/app.js`.

No requiere Node.js ni instalar dependencias. Google Fonts es opcional; si no hay conexión, se usan tipografías alternativas.

## Contenido

- Portada con la ilustración de referencia enviada y la flor violeta.
- Cinta animada con frases motivadoras.
- Cuatro módulos educativos con situaciones ficticias y feedback.
- Quiz inicial, plan personal imprimible, verificador preventivo de ofertas, simulador de chat y guía de evidencias.
- Biblioteca de consejos, mensajes inspiradores, progreso local y rutas de orientación.
- Accesibilidad básica, diseño responsive, contraste alternativo y salida rápida.
- Botón para solicitar ubicación bajo permiso del navegador y preparar un mensaje para compartir manualmente.

## Importante sobre seguridad

Este proyecto es un **prototipo educativo**, no un servicio de emergencia. No envía SOS automáticamente, no ofrece seguimiento GPS en vivo, no contacta autoridades y no tiene backend, panel administrativo ni estadísticas centralizadas. La ubicación solo se solicita después de pulsar el botón y aceptar el permiso; el enlace se muestra para que la persona decida si lo comparte. La salida rápida redirige a Google, pero no elimina el historial ni garantiza ocultar actividad. La pantalla neutral puede no borrar registros del navegador.

El progreso se guarda en `localStorage` de este navegador. El plan personal se procesa en la página y puede imprimirse; evita introducir datos que te identifiquen si el dispositivo no es seguro. Los enlaces de ayuda son referencias generales a portales oficiales peruanos: confirma los datos, horarios y servicios locales vigentes antes de publicarlos como directorio definitivo.

## Estructura

```text
Codigo_Violeta/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── assets/
    ├── flor-violeta.png
    ├── referencia-panel.png
    ├── portada-ilustrada.png
    └── mujeres-bicentenario.png
```
