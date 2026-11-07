# Carta para ti

Página de una sola hoja con una carta y un espacio para escribir una respuesta.

## Archivos

- `index.html`: la carta y la sección "Tu respuesta".
- `style.css`: diseño (claro y oscuro automático).
- `app.js`: guarda la respuesta y la muestra después.
- `respuesta.json`: aquí queda la respuesta. Empieza vacío.

## Subirla a GitHub

1. Crea un repositorio nuevo en GitHub y sube estos archivos.
2. Entra a **Settings → Pages**.
3. En **Source** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
4. En unos minutos GitHub muestra la dirección de la página.

## Cómo funciona la respuesta

GitHub Pages solo sirve archivos; la página no puede escribir sobre `respuesta.json` por sí sola.

1. Ella escribe su respuesta y pulsa **Guardar respuesta**. Queda guardada en su navegador y la ve cada vez que vuelve a abrir la página en ese mismo dispositivo.
2. Para que te llegue, pulsa **Descargar respuesta.json** y te manda el archivo (o usa **Copiar contenido**).
3. Tú reemplazas `respuesta.json` del repositorio con ese archivo (en GitHub: abre el archivo, lápiz de editar, pega el contenido, **Commit changes**).
4. Desde ese momento la respuesta aparece en la página para cualquiera que la abra.

Formato de `respuesta.json`:

```json
{
  "mensaje": "texto de la respuesta",
  "fecha": "2026-11-06T20:00:00.000Z"
}
```

## Privacidad

Si el repositorio es público, cualquiera puede leer la carta y la respuesta. Para que no sea así, usa un repositorio privado (GitHub Pages con repositorio privado requiere un plan de pago) o comparte la página solo con ella y no la publiques.
