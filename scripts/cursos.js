/* =====================================================
   LMS ABC — cursos.js
   CRUD completo de Cursos
   ===================================================== */

let editCursoId = null;

const BANNERS = [
  { bg: 'linear-gradient(135deg,#6c63ff,#3f3d56)', emoji: '🖥️' },
  { bg: 'linear-gradient(135deg,#f7b731,#f0932b)', emoji: '📐' },
  { bg: 'linear-gradient(135deg,#43e97b,#38f9d7)', emoji: '🧬' },
  { bg: 'linear-gradient(135deg,#ff6584,#ff4757)', emoji: '⚗️' },
  { bg: 'linear-gradient(135deg,#4facfe,#00f2fe)', emoji: '🌍' },
  { bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', emoji: '📖' },
];

/* ---- RENDER ---- */

function renderCursos() {
  const q = (document.getElementById('search-cursos')?.value || '').toLowerCase();
  const cursos   = LS.get('cursos').filter(c =>
    (c.nombre + ' ' + c.codigo + ' ' + c.descripcion).toLowerCase().includes(q)
  );
  const docentes = LS.get('docentes');
  const grid     = document.getElementById('cursos-grid');

  if (!cursos.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">📚</div><p>No hay cursos registrados</p>
    </div>`;
    return;
  }

  grid.innerHTML = cursos.map((c, i) => {
    const b   = BANNERS[i % BANNERS.length];
    const doc = docentes.find(d => d.id === c.docenteId);
    return `
      <div class="course-card">
        <div class="course-banner" style="background:${b.bg}">${b.emoji}</div>
        <div class="course-body">
          <div class="course-title">${c.nombre}</div>
          <div class="course-desc">${c.descripcion}</div>
          <div class="course-meta">
            <span class="badge badge-blue">${c.codigo}</span>
            ${doc ? `<span class="course-teacher">👨‍🏫 ${doc.nombres} ${doc.apellidos}</span>` : ''}
          </div>
          <div class="course-footer">
            <button class="btn btn-secondary btn-sm" onclick="openModalCurso('${c.id}')">✏️ Editar</button>
            <button class="btn btn-danger btn-sm"    onclick="confirmDelete('curso','${c.id}')">🗑️</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ---- MODAL ---- */

function openModalCurso(id) {
  editCursoId = id || null;
  document.getElementById('modal-curso-title').textContent = id ? 'Editar Curso' : 'Nuevo Curso';

  // Poblar select de docentes
  const sel      = document.getElementById('c-docente');
  const docentes = LS.get('docentes');
  sel.innerHTML  = '<option value="">Seleccionar docente...</option>' +
    docentes.map(d => `<option value="${d.id}">${d.nombres} ${d.apellidos} (${d.area})</option>`).join('');

  // Limpiar campos
  ['codigo', 'nombre', 'descripcion', 'docente'].forEach(f => {
    const el = document.getElementById('c-' + f);
    if (el) el.value = '';
  });

  if (id) {
    const c = LS.get('cursos').find(x => x.id === id);
    if (c) {
      document.getElementById('c-codigo').value      = c.codigo;
      document.getElementById('c-nombre').value      = c.nombre;
      document.getElementById('c-descripcion').value = c.descripcion;
      document.getElementById('c-docente').value     = c.docenteId;
    }
  }
  openModal('modal-curso');
}

function saveCurso() {
  const codigo      = document.getElementById('c-codigo').value.trim();
  const nombre      = document.getElementById('c-nombre').value.trim();
  const descripcion = document.getElementById('c-descripcion').value.trim();
  const docenteId   = document.getElementById('c-docente').value;

  if (!codigo || !nombre || !descripcion || !docenteId) {
    toast('Completa todos los campos', 'error');
    return;
  }

  const cursos = LS.get('cursos');
  if (editCursoId) {
    const idx = cursos.findIndex(c => c.id === editCursoId);
    if (idx !== -1) cursos[idx] = { ...cursos[idx], codigo, nombre, descripcion, docenteId };
  } else {
    cursos.push({ id: codigo, codigo, nombre, descripcion, docenteId });
  }

  LS.set('cursos', cursos);
  closeModal('modal-curso');
  renderCursos();
  updateDashboard();
  populateCursoSelect();
  toast(editCursoId ? 'Curso actualizado ✅' : 'Curso creado ✅', 'success');
  editCursoId = null;
}

/* ---- VISTA PÚBLICA ---- */

function renderPublicCourses() {
  const cursos   = LS.get('cursos');
  const docentes = LS.get('docentes');
  const modulos  = LS.get('modulos');
  const lecciones = LS.get('lecciones');
  const grid     = document.getElementById('public-courses-grid');

  if (!cursos.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">📚</div><p>No hay cursos disponibles aún</p>
    </div>`;
    return;
  }

  grid.innerHTML = cursos.map((c, i) => {
    const b         = BANNERS[i % BANNERS.length];
    const doc       = docentes.find(d => d.id === c.docenteId);
    const mods      = modulos.filter(m => m.cursoId === c.id);
    const totalLecs = mods.reduce((acc, m) => acc + lecciones.filter(l => l.moduloId === m.id).length, 0);
    return `
      <div class="course-card">
        <div class="course-banner" style="background:${b.bg}">${b.emoji}</div>
        <div class="course-body">
          <div class="course-title">${c.nombre}</div>
          <div class="course-desc">${c.descripcion}</div>
          <div class="course-meta">
            <span class="badge badge-blue">${c.codigo}</span>
            <span class="badge badge-green">${mods.length} módulo${mods.length !== 1 ? 's' : ''}</span>
            <span class="badge badge-yellow">${totalLecs} lección${totalLecs !== 1 ? 'es' : ''}</span>
          </div>
          ${doc ? `<div style="font-size:12px;color:var(--text2)">👨‍🏫 ${doc.nombres} ${doc.apellidos} · ${doc.area}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}
