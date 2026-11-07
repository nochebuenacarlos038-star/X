# Carta para ti

Página de una sola hoja con una carta y un espacio para escribir una respuesta. Las respuestas se guardan en Firestore.

## Archivos

- `index.html`: la carta y la sección "Tu respuesta".
- `style.css`: diseño (claro y oscuro automático).
- `firebase-config.js`: configuración del proyecto de Firebase.
- `app.js`: guarda la respuesta en Firestore y la muestra después en el mismo navegador.

## Dónde se guardan los mensajes

Colección `mensajes` de Firestore. Cada mensaje es un documento cuyo id es un número que sigue la cantidad de mensajes: `0`, `1`, `2`, etc. Cada documento tiene estos campos:

- `mensaje`: el texto.
- `fecha`: fecha y hora en formato ISO.

Si ya existe un documento con ese número, la página usa el siguiente libre, así que nunca se sobrescribe un mensaje anterior.

## Reglas de Firestore

La página necesita permiso para leer y crear documentos en `mensajes`. Si al guardar aparece `permission-denied`, en la consola de Firebase entra a **Firestore Database → Reglas** y usa:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mensajes/{id} {
      allow read, create: if true;
      allow update, delete: if false;
    }
  }
}
```

Con estas reglas, cualquiera que conozca el proyecto podría leer los mensajes. Si eso te preocupa, dímelo y lo cambiamos.

Si aparece un error de que la base de datos no existe, crea una en **Firestore Database → Crear base de datos** (es distinta de Realtime Database).

## Abrirla

Funciona abriendo `index.html` directamente en el navegador, y también publicada en GitHub: **Settings → Pages → Deploy from a branch → `main` / root**.
