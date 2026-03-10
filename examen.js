var tabActual = "tarjetas";
var editandoId = null;
var borrandoId = null;

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mostrarToast(msg, tipo) {
  var el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast " + tipo + " show";
  setTimeout(function() { el.classList.remove("show"); }, 3000);
}

function cambiarTab(tab) {
  tabActual = tab;
  document.getElementById("tab-btn-tarjetas").classList.toggle("active", tab === "tarjetas");
  document.getElementById("tab-btn-tabla").classList.toggle("active", tab === "tabla");
  document.getElementById("vista-tarjetas").style.display = tab === "tarjetas" ? "block" : "none";
  document.getElementById("vista-tabla").style.display    = tab === "tabla"    ? "block" : "none";
  renderEstudiantes();
}

function renderEstudiantes() {
  var q = document.getElementById("buscador").value.toLowerCase();
  var estudiantes = getData("estudiantes");
  var cursos = getData("cursos");

  var filtrados = estudiantes.filter(function(e) {
    return (e.nombres + " " + e.apellidos + " " + e.identificacion).toLowerCase().includes(q);
  });

  if (tabActual === "tarjetas") {
    renderTarjetas(filtrados, cursos);
  } else {
    renderTabla(filtrados, cursos);
  }
}

function renderTarjetas(lista, cursos) {
  var grid = document.getElementById("grid-estudiantes");

  if (lista.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🎒</div><p>No hay estudiantes registrados</p></div>';
    return;
  }

  var html = "";
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    var iniciales = (e.nombres[0] || "") + (e.apellidos[0] || "");
    var cursosDelEstudiante = (e.cursos || []).map(function(id) {
      var c = cursos.find(function(x) { return x.id === id; });
      return c ? '<span class="badge badge-blue">' + c.nombre + '</span>' : "";
    }).join("");

    html += '<div class="student-card">';
    html += '  <div class="student-avatar">' + iniciales.toUpperCase() + '</div>';
    html += '  <div class="student-name">' + e.nombres + " " + e.apellidos + '</div>';
    html += '  <div class="student-id">ID: ' + e.identificacion + '</div>';
    html += '  <div class="student-info">⚥ ' + e.genero + '</div>';
    html += '  <div class="student-info">📅 ' + e.fechaNacimiento + '</div>';
    if (e.telefono) html += '  <div class="student-info">📞 ' + e.telefono + '</div>';
    html += '  <div class="student-cursos">' + (cursosDelEstudiante || '<span style="font-size:12px;color:var(--text3)">Sin cursos</span>') + '</div>';
    html += '  <div class="student-actions">';
    html += '    <button class="btn btn-secondary btn-sm" onclick="verEstudiante(\'' + e.id + '\')">👁️</button>';
    html += '    <button class="btn btn-secondary btn-sm" onclick="abrirModal(\'' + e.id + '\')">✏️</button>';
    html += '    <button class="btn btn-danger btn-sm" onclick="pedirBorrar(\'' + e.id + '\')">🗑️</button>';
    html += '  </div>';
    html += '</div>';
  }
  grid.innerHTML = html;
}

function renderTabla(lista, cursos) {
  var tbody = document.getElementById("tabla-estudiantes");

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:32px">Sin resultados</td></tr>';
    return;
  }

  var html = "";
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    var totalCursos = (e.cursos || []).length;
    html += '<tr>';
    html += '  <td>' + e.identificacion + '</td>';
    html += '  <td><strong>' + e.nombres + " " + e.apellidos + '</strong></td>';
    html += '  <td>' + e.genero + '</td>';
    html += '  <td>' + (e.telefono || "—") + '</td>';
    html += '  <td><span class="badge badge-green">' + totalCursos + ' curso' + (totalCursos !== 1 ? 's' : '') + '</span></td>';
    html += '  <td><div class="td-actions">';
    html += '    <button class="btn btn-secondary btn-sm" onclick="verEstudiante(\'' + e.id + '\')">👁️</button>';
    html += '    <button class="btn btn-secondary btn-sm" onclick="abrirModal(\'' + e.id + '\')">✏️</button>';
    html += '    <button class="btn btn-danger btn-sm" onclick="pedirBorrar(\'' + e.id + '\')">🗑️</button>';
    html += '  </div></td>';
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

function abrirModal(id) {
  editandoId = id || null;
  document.getElementById("modal-titulo").textContent = id ? "Editar Estudiante" : "Nuevo Estudiante";

  document.getElementById("e-id").value          = "";
  document.getElementById("e-nombres").value     = "";
  document.getElementById("e-apellidos").value   = "";
  document.getElementById("e-genero").value      = "";
  document.getElementById("e-fecha").value       = "";
  document.getElementById("e-telefono").value    = "";
  document.getElementById("e-direccion").value   = "";

  cargarCheckboxes([]);

  if (id) {
    var estudiantes = getData("estudiantes");
    var e = estudiantes.find(function(x) { return x.id === id; });
    if (e) {
      document.getElementById("e-id").value        = e.identificacion;
      document.getElementById("e-nombres").value   = e.nombres;
      document.getElementById("e-apellidos").value = e.apellidos;
      document.getElementById("e-genero").value    = e.genero;
      document.getElementById("e-fecha").value     = e.fechaNacimiento;
      document.getElementById("e-telefono").value  = e.telefono || "";
      document.getElementById("e-direccion").value = e.direccion || "";
      cargarCheckboxes(e.cursos || []);
    }
  }

  document.getElementById("modal-estudiante").classList.add("open");
}

function cargarCheckboxes(seleccionados) {
  var cursos = getData("cursos");
  var wrap = document.getElementById("cursos-checkboxes");

  if (cursos.length === 0) {
    wrap.innerHTML = '<p style="font-size:13px;color:var(--text3)">No hay cursos disponibles</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < cursos.length; i++) {
    var c = cursos[i];
    var marcado = seleccionados.includes(c.id);
    html += '<label class="checkbox-item ' + (marcado ? "seleccionado" : "") + '" onclick="toggleCheckbox(this)">';
    html += '  <input type="checkbox" value="' + c.id + '" ' + (marcado ? "checked" : "") + '>';
    html += '  ' + c.nombre;
    html += '</label>';
  }
  wrap.innerHTML = html;
}

function toggleCheckbox(label) {
  var input = label.querySelector("input");
  input.checked = !input.checked;
  label.classList.toggle("seleccionado", input.checked);
}

function cerrarModal() {
  document.getElementById("modal-estudiante").classList.remove("open");
  editandoId = null;
}

function guardarEstudiante() {
  var identificacion  = document.getElementById("e-id").value.trim();
  var nombres         = document.getElementById("e-nombres").value.trim();
  var apellidos       = document.getElementById("e-apellidos").value.trim();
  var genero          = document.getElementById("e-genero").value;
  var fechaNacimiento = document.getElementById("e-fecha").value;
  var telefono        = document.getElementById("e-telefono").value.trim();
  var direccion       = document.getElementById("e-direccion").value.trim();

  if (!identificacion || !nombres || !apellidos || !genero || !fechaNacimiento) {
    mostrarToast("Completa los campos obligatorios", "error");
    return;
  }

  var cursosSeleccionados = [];
  var checks = document.querySelectorAll("#cursos-checkboxes input:checked");
  for (var i = 0; i < checks.length; i++) {
    cursosSeleccionados.push(checks[i].value);
  }

  var estudiantes = getData("estudiantes");

  if (editandoId) {
    for (var i = 0; i < estudiantes.length; i++) {
      if (estudiantes[i].id === editandoId) {
        estudiantes[i].identificacion  = identificacion;
        estudiantes[i].nombres         = nombres;
        estudiantes[i].apellidos       = apellidos;
        estudiantes[i].genero          = genero;
        estudiantes[i].fechaNacimiento = fechaNacimiento;
        estudiantes[i].telefono        = telefono;
        estudiantes[i].direccion       = direccion;
        estudiantes[i].cursos          = cursosSeleccionados;
        break;
      }
    }
    mostrarToast("Estudiante actualizado ✅", "success");
  } else {
    var nuevo = {
      id: "EST-" + Date.now(),
      identificacion:  identificacion,
      nombres:         nombres,
      apellidos:       apellidos,
      genero:          genero,
      fechaNacimiento: fechaNacimiento,
      telefono:        telefono,
      direccion:       direccion,
      cursos:          cursosSeleccionados
    };
    estudiantes.push(nuevo);
    mostrarToast("Estudiante creado ✅", "success");
  }

  setData("estudiantes", estudiantes);
  cerrarModal();
  renderEstudiantes();
}

function verEstudiante(id) {
  var estudiantes = getData("estudiantes");
  var cursos = getData("cursos");
  var e = estudiantes.find(function(x) { return x.id === id; });
  if (!e) return;

  var iniciales = (e.nombres[0] || "") + (e.apellidos[0] || "");
  var cursosHTML = (e.cursos || []).map(function(cid) {
    var c = cursos.find(function(x) { return x.id === cid; });
    return c ? '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:8px"><strong>' + c.nombre + '</strong><br><span style="color:var(--text3)">' + c.codigo + '</span></div>' : "";
  }).join("");

  document.getElementById("ver-contenido").innerHTML =
    '<div class="detail-header">' +
      '<div class="detail-avatar">' + iniciales.toUpperCase() + '</div>' +
      '<div class="detail-info">' +
        '<h2>' + e.nombres + ' ' + e.apellidos + '</h2>' +
        '<p>ID: ' + e.identificacion + '</p>' +
        '<p>' + e.genero + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="info-grid">' +
      '<div class="info-item"><label>Fecha de Nacimiento</label><span>' + e.fechaNacimiento + '</span></div>' +
      '<div class="info-item"><label>Teléfono</label><span>' + (e.telefono || "—") + '</span></div>' +
      '<div class="info-item" style="grid-column:1/-1"><label>Dirección</label><span>' + (e.direccion || "—") + '</span></div>' +
    '</div>' +
    '<h3 style="font-size:14px;margin-bottom:12px;color:var(--text2)">📚 Cursos Asociados (' + (e.cursos || []).length + ')</h3>' +
    (cursosHTML || '<p style="font-size:13px;color:var(--text3)">Sin cursos asociados</p>');

  document.getElementById("modal-ver").classList.add("open");
}

function cerrarVer() {
  document.getElementById("modal-ver").classList.remove("open");
}

function pedirBorrar(id) {
  borrandoId = id;
  document.getElementById("btn-confirmar-borrar").onclick = function() { borrarEstudiante(); };
  document.getElementById("modal-borrar").classList.add("open");
}

function cerrarBorrar() {
  document.getElementById("modal-borrar").classList.remove("open");
  borrandoId = null;
}

function borrarEstudiante() {
  var estudiantes = getData("estudiantes");
  var nuevos = estudiantes.filter(function(e) { return e.id !== borrandoId; });
  setData("estudiantes", nuevos);
  cerrarBorrar();
  renderEstudiantes();
  mostrarToast("Estudiante eliminado", "success");
}

document.querySelectorAll(".modal-overlay").forEach(function(overlay) {
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) overlay.classList.remove("open");
  });
});

renderEstudiantes();
