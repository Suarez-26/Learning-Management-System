/* =====================================================
   LMS ABC — modulos.js
   CRUD de Módulos y Lecciones
   ===================================================== */

let editModuloId        = null;
let currentModuloCursoId = null;
let editLeccionId       = null;
let currentLeccionModuloId = null;
let tempMedia           = [];

const MEDIA_ICONS = { video: '🎥', pdf: '📄', imagen: '🖼️', enlace: '🔗' };

/* =====================================================
   MÓDULOS
   ===================================================== */

function populateCursoSelect() {
  const sel = document.getElementById('select-curso-modulos');
  if (!sel) return;
  const cursos  = LS.get('cursos');
  sel.innerHTML = '<option value="">-- Seleccionar curso --</option>' +
    cursos.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  if (currentModuloCursoId) sel.value = currentModuloCursoId;
}

function renderModulos() {
  const cursoId = document.getElementById('select-curso-modulos')?.value;
  currentModuloCursoId = cursoId;
  const list    = document.getElementById('modulos-list');

  if (!cursoId) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📦</div><p>Selecciona un curso para ver sus módulos</p>
    </div>`;
    return;
  }

  const modulos   = LS.get('modulos').filter(m => m.cursoId === cursoId);
  const lecciones = LS.get('lecciones');

  if (!modulos.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📦</div><p>No hay módulos en este curso</p>
    </div>`;
    return;
  }

  list.innerHTML = modulos.map(m => {
    const lecs = lecciones.filter(l => l.moduloId === m.id);
    return `
      <div class="module-item">
        <div class="module-header" onclick="toggleModule('${m.id}')">
          <span class="module-toggle" id="toggle-${m.id}">▶</span>
          <div>
            <div class="module-title">${m.nombre}</div>
            <div style="font-size:12px;color:var(--text3)">${m.codigo} · ${lecs.length} lección${lecs.length !== 1 ? 'es' : ''}</div>
          </div>
          <div class="module-actions" onclick="event.stopPropagation()">
            <button class="btn btn-success btn-sm"    onclick="openModalLeccion('${m.id}')">+ Lección</button>
            <button class="btn btn-secondary btn-sm"  onclick="openModalModulo('${m.id}')">✏️</button>
            <button class="btn btn-danger btn-sm"     onclick="confirmDelete('modulo','${m.id}')">🗑️</button>
          </div>
        </div>
        <div class="module-lessons" id="lessons-${m.id}">
          <div style="padding-top:12px">
            ${lecs.length
              ? lecs.map(l => `
                  <div class="lesson-item">
                    <span class="lesson-icon">📋</span>
                    <div class="lesson-info">
                      <div class="lesson-title">${l.titulo}</div>
                      <div class="lesson-hours">⏱️ ${l.horas}h · ${l.multimedia?.length || 0} recurso(s)</div>
                    </div>
                    <div class="td-actions">
                      <button class="btn btn-secondary btn-sm" onclick="viewLeccion('${l.id}')">👁️</button>
                      <button class="btn btn-secondary btn-sm" onclick="openModalLeccion('${m.id}','${l.id}')">✏️</button>
                      <button class="btn btn-danger btn-sm"    onclick="confirmDelete('leccion','${l.id}')">🗑️</button>
                    </div>
                  </div>`).join('')
              : '<p style="color:var(--text3);font-size:13px;padding:8px 0">Sin lecciones en este módulo</p>'
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

function toggleModule(id) {
  document.getElementById('lessons-' + id).classList.toggle('open');
  document.getElementById('toggle-' + id).classList.toggle('open');
}

function openModalModulo(id) {
  editModuloId = id || null;
  document.getElementById('modal-modulo-title').textContent = id ? 'Editar Módulo' : 'Nuevo Módulo';
  ['codigo', 'nombre', 'descripcion'].forEach(f => document.getElementById('m-' + f).value = '');
  if (id) {
    const m = LS.get('modulos').find(x => x.id === id);
    if (m) {
      document.getElementById('m-codigo').value      = m.codigo;
      document.getElementById('m-nombre').value      = m.nombre;
      document.getElementById('m-descripcion').value = m.descripcion || '';
    }
  }
  openModal('modal-modulo');
}

function saveModulo() {
  const cursoId    = document.getElementById('select-curso-modulos')?.value;
  if (!cursoId) { toast('Selecciona un curso primero', 'error'); return; }
  const codigo     = document.getElementById('m-codigo').value.trim();
  const nombre     = document.getElementById('m-nombre').value.trim();
  const descripcion = document.getElementById('m-descripcion').value.trim();
  if (!codigo || !nombre) { toast('Completa los campos obligatorios', 'error'); return; }

  const mods = LS.get('modulos');
  if (editModuloId) {
    const idx = mods.findIndex(m => m.id === editModuloId);
    if (idx !== -1) mods[idx] = { ...mods[idx], codigo, nombre, descripcion };
  } else {
    mods.push({ id: codigo + '-' + Date.now(), codigo, cursoId, nombre, descripcion });
  }

  LS.set('modulos', mods);
  closeModal('modal-modulo');
  updateDashboard();
  renderModulos();
  toast(editModuloId ? 'Módulo actualizado ✅' : 'Módulo creado ✅', 'success');
  editModuloId = null;
}

/* =====================================================
   LECCIONES
   ===================================================== */

function openModalLeccion(moduloId, leccionId) {
  currentLeccionModuloId = moduloId;
  editLeccionId = leccionId || null;
  document.getElementById('modal-leccion-title').textContent = leccionId ? 'Editar Lección' : 'Nueva Lección';
  ['titulo', 'horas', 'contenido'].forEach(f => document.getElementById('l-' + f).value = '');
  tempMedia = [];
  renderTempMedia();

  if (leccionId) {
    const l = LS.get('lecciones').find(x => x.id === leccionId);
    if (l) {
      document.getElementById('l-titulo').value    = l.titulo;
      document.getElementById('l-horas').value     = l.horas;
      document.getElementById('l-contenido').value = l.contenido || '';
      tempMedia = [...(l.multimedia || [])];
      renderTempMedia();
    }
  }
  openModal('modal-leccion');
}

function addMedia() {
  const tipo = document.getElementById('l-media-tipo').value;
  const url  = document.getElementById('l-media-url').value.trim();
  if (!url) { toast('Ingresa una URL', 'error'); return; }
  tempMedia.push({ tipo, url });
  document.getElementById('l-media-url').value = '';
  renderTempMedia();
}

function renderTempMedia() {
  document.getElementById('l-media-list').innerHTML = tempMedia.map((m, i) =>
    `<div class="media-tag">
      ${MEDIA_ICONS[m.tipo]} ${m.url.slice(0, 35)}${m.url.length > 35 ? '...' : ''}
      <button onclick="removeMedia(${i})">✕</button>
    </div>`
  ).join('');
}

function removeMedia(i) { tempMedia.splice(i, 1); renderTempMedia(); }

function saveLeccion() {
  const titulo   = document.getElementById('l-titulo').value.trim();
  const horas    = document.getElementById('l-horas').value;
  const contenido = document.getElementById('l-contenido').value.trim();
  if (!titulo || !horas) { toast('Título e intensidad horaria son obligatorios', 'error'); return; }

  const lecs = LS.get('lecciones');
  if (editLeccionId) {
    const idx = lecs.findIndex(l => l.id === editLeccionId);
    if (idx !== -1) lecs[idx] = { ...lecs[idx], titulo, horas: parseInt(horas), contenido, multimedia: [...tempMedia] };
  } else {
    lecs.push({ id: 'LEC-' + Date.now(), moduloId: currentLeccionModuloId, titulo, horas: parseInt(horas), contenido, multimedia: [...tempMedia] });
  }

  LS.set('lecciones', lecs);
  closeModal('modal-leccion');
  renderModulos();
  toast(editLeccionId ? 'Lección actualizada ✅' : 'Lección creada ✅', 'success');
  editLeccionId = null;
}

function viewLeccion(id) {
  const l = LS.get('lecciones').find(x => x.id === id);
  if (!l) return;

  document.getElementById('view-leccion-content').innerHTML = `
    <div style="margin-bottom:20px">
      <h2 style="font-size:20px;margin-bottom:6px">${l.titulo}</h2>
      <span class="badge badge-blue">⏱️ ${l.horas} hora${l.horas !== 1 ? 's' : ''}</span>
    </div>
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:16px">
      <div style="font-size:12px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Material de Estudio</div>
      <p style="font-size:14px;line-height:1.7;color:var(--text2)">${l.contenido || 'Sin contenido'}</p>
    </div>
    ${l.multimedia?.length ? `
      <div>
        <div style="font-size:12px;color:var(--text3);margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Recursos Multimedia (${l.multimedia.length})</div>
        ${l.multimedia.map(m => `
          <a href="${m.url}" target="_blank"
             style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:8px;text-decoration:none;color:var(--text);font-size:13px;transition:border-color 0.2s"
             onmouseover="this.style.borderColor='var(--accent)'"
             onmouseout="this.style.borderColor='var(--border)'">
            ${MEDIA_ICONS[m.tipo]}
            <span>${m.tipo.toUpperCase()}</span>
            <span style="color:var(--text3);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.url}</span>
            🔗
          </a>`).join('')}
      </div>` : ''}`;
  openModal('modal-view-leccion');
}
