# Jendal

Prototipo de interfaz de asistencia industrial basado en `REF.png` y `Brief.pdf`. Usa los SVG originales de `Assets/`. HTML, CSS y JavaScript sin dependencias.

## Abrir

Abrir `index.html` en el navegador o iniciar un servidor local:

```sh
python3 -m http.server 8000
```

Visitar http://localhost:8000. El servidor local permite usar las API del navegador para copiar y dictar (según compatibilidad y permisos).

## Incluye

- Diseño adaptable, tema oscuro fijo, interfaz en español, inglés y portugués.
- Sesiones con ticket, activo y prioridad; historial, borradores y preferencias guardados en localStorage.
- Conversación de demostración, respuestas sin evidencia explícitas y resumen para cambio de turno.
- Panel contextual, fuentes e incidentes relacionados con estado vacío honesto.
- Biblioteca local de PDF: agregar, abrir y quitar archivos durante la visita.
- Simulación de disponibilidad del agente y cierre de ticket desde Configuración.
- Dictado si el navegador ofrece SpeechRecognition. Este servicio depende del navegador.
- Comandos `/procedure`, `/related`, `/history` y `/summarize`.

## Pendiente de integración

No hay un backend ni una conexión a Janus, tickets o base documental. Las respuestas son demostraciones. El inicio muestra un chat vacío, sin tickets de ejemplo. No se inventan procedimientos, fuentes ni diagnósticos. Los PDF no se procesan ni se envían al agente. Para producción se necesita el contrato de API de Janus y autenticación; las credenciales deben permanecer en el servidor.

Se conserva la marca Jendal y la dirección visual de la referencia; el brief utiliza el nombre Agendal y sirve como guía funcional.

## Tipografía

Albert Sans para la interfaz, mensajes y datos; Cooper BT Regular para los títulos. Archivos locales en `Assets/fonts/`, sin solicitudes a proveedores externos.

## Bienvenida y clima

Cada sesión vacía muestra un saludo según la hora y el día locales, con el campo de consulta centrado. Al enviar la primera consulta, el campo pasa al pie de la conversación. Las conversaciones previas se conservan.

El clima es opcional: el botón de ubicación solicita permiso al navegador y consulta temperatura y código meteorológico en Open-Meteo (`https://open-meteo.com/en/docs`). Se envían coordenadas aproximadas con dos decimales, sin guardarlas; el resultado permanece en memoria hasta 30 minutos. Ante permisos denegados, fallos de red o datos inválidos, se mantiene la bienvenida por día y hora. Geolocalización requiere un contexto seguro (localhost o HTTPS). Las pruebas de clima usan respuestas simuladas; falta comprobar el servicio real desde el entorno de despliegue.
