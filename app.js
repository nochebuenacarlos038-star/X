(function () {
  'use strict';

  var KEY = 'carta_respuesta';
  var $ = function (id) { return document.getElementById(id); };

  var texto = $('mensaje');
  var vacio = $('vacio');
  var vista = $('vista');
  var vistaTexto = $('vista-texto');
  var vistaFecha = $('vista-fecha');
  var envio = $('envio');
  var aviso = $('aviso');
  var crudo = $('crudo');
  var actual = null;

  function fechaLarga(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  function comoJson(o) {
    return JSON.stringify(o, null, 2) + '\n';
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

  // Al abrir: primero lo que haya en respuesta.json del repositorio, si no, lo guardado en este navegador.
  fetch('respuesta.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .catch(function () { return null; })
    .then(function (repo) {
      var local = leerLocal();
      if (valida(repo)) {
        actual = repo;
        mostrar(actual);
      } else if (valida(local)) {
        actual = local;
        mostrar(actual);
        envio.hidden = false;
      }
    });

  $('guardar').addEventListener('click', function () {
    var m = texto.value.trim();
    if (!m) {
      vacio.hidden = false;
      texto.focus();
      return;
    }
    vacio.hidden = true;
    actual = { mensaje: m, fecha: new Date().toISOString() };
    guardarLocal(actual);
    mostrar(actual);
    envio.hidden = false;
    aviso.textContent = '';
    crudo.hidden = true;
    vista.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  $('editar').addEventListener('click', function () {
    if (!actual) return;
    texto.value = actual.mensaje;
    texto.focus();
  });

  $('descargar').addEventListener('click', function () {
    if (!actual) return;
    var blob = new Blob([comoJson(actual)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'respuesta.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    aviso.textContent = 'Archivo descargado.';
  });

  $('copiar').addEventListener('click', function () {
    if (!actual) return;
    var t = comoJson(actual);
    var listo = function () { aviso.textContent = 'Contenido copiado.'; };
    var respaldo = function () {
      crudo.value = t;
      crudo.hidden = false;
      crudo.focus();
      crudo.select();
      aviso.textContent = 'Selecciona el texto de abajo y cópialo.';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(listo, respaldo);
    } else {
      respaldo();
    }
  });
})();
