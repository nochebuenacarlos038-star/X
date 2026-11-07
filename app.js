(function () {
  'use strict';

  var KEY = 'carta_respuesta';
  var COLECCION = 'mensajes';
  var $ = function (id) { return document.getElementById(id); };

  var texto = $('mensaje');
  var vacio = $('vacio');
  var vista = $('vista');
  var vistaTexto = $('vista-texto');
  var vistaFecha = $('vista-fecha');
  var estado = $('estado');
  var boton = $('guardar');
  var actual = null;

  // Firebase (Firestore)
  var db = null;
  try {
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    db = firebase.firestore();
  } catch (e) {
    console.error('No se pudo iniciar Firebase', e);
  }

  function fechaLarga(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function valida(o) {
    return !!o && typeof o.mensaje === 'string' && o.mensaje.trim() !== '';
  }

  function leerLocal() {
    try {
      var s = localStorage.getItem(KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  function guardarLocal(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* sin almacenamiento */ }
  }

  function mostrar(o) {
    vistaTexto.textContent = o.mensaje;
    var f = o.fecha ? fechaLarga(o.fecha) : '';
    vistaFecha.textContent = f ? 'Escrita el ' + f : '';
    vista.hidden = false;
  }

  function avisar(msg, esError) {
    estado.textContent = msg;
    estado.className = esError ? 'error' : 'note';
  }

  // Crea un documento en "mensajes" con id 0, 1, 2, ... según los que ya existen.
  // La transacción evita pisar un documento que ya exista si dos mensajes llegan a la vez.
  function guardarEnFirebase(mensaje, fecha) {
    var col = db.collection(COLECCION);
    return col.get().then(function (snap) {
      function intentar(i) {
        var ref = col.doc(String(i));
        return db.runTransaction(function (tx) {
          return tx.get(ref).then(function (s) {
            if (s.exists) return false;
            tx.set(ref, { mensaje: mensaje, fecha: fecha });
            return true;
          });
        }).then(function (libre) {
          return libre ? i : intentar(i + 1);
        });
      }
      return intentar(snap.size);
    });
  }

  // Al abrir: muestra la última respuesta guardada en este navegador.
  var previa = leerLocal();
  if (valida(previa)) {
    actual = previa;
    mostrar(actual);
  }

  boton.addEventListener('click', function () {
    var m = texto.value.trim();
    if (!m) {
      vacio.hidden = false;
      texto.focus();
      return;
    }
    vacio.hidden = true;

    if (!db) {
      avisar('No se pudo conectar. Recarga la página e inténtalo de nuevo.', true);
      return;
    }

    var nueva = { mensaje: m, fecha: new Date().toISOString() };
    boton.disabled = true;
    avisar('Guardando…', false);

    guardarEnFirebase(nueva.mensaje, nueva.fecha)
      .then(function () {
        actual = nueva;
        guardarLocal(actual);
        mostrar(actual);
        avisar('Tu respuesta se guardó.', false);
        vista.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      })
      .catch(function (e) {
        console.error('Error al guardar en Firestore', e);
        avisar('No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.', true);
      })
      .then(function () {
        boton.disabled = false;
      });
  });

  $('editar').addEventListener('click', function () {
    if (!actual) return;
    texto.value = actual.mensaje;
    texto.focus();
  });
})();
