/* =====================================================
   LMS ABC — docentes.js
   CRUD completo de Docentes
   ===================================================== */

let editDocenteId = null;

/* ---- RENDER ---- */

function renderDocentes() {
  const q = (
    document.getElementById('search-docentes')?.value ||
    document.getElementById('search-docentes2')?.value || ''
  ).toLowerCase();

  const docs   = LS.get('docentes').filter(d =>
    (d.nombres + ' ' + d.apellidos + ' ' + d.codigo + ' ' + d.area + ' ' + d.email)
      .toLowerCase().includes(q)
  );
  const cursos = LS.get('cursos');

  _renderDocentesGrid(docs, cursos);
  _renderDocentesTable(docs, cursos);
}

function _renderDocentesGrid(docs, cursos) {
  const grid = document.getElementById('docentes-grid');
  if (!docs.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">👨‍🏫</div><p>No hay docentes registrados</p>
    </div>`;
    return;
  }
  grid.innerHTML = docs.map(d => {
    const nc       = cursos.filter(c => c.docenteId === d.id).length;
    const initials = (d.nombres[0] || '') + (d.apellidos[0] || '');
    const avatarHtml = d.foto
      ? `<div class="teacher-avatar"><img src="${d.foto}" alt="${initials}" onerror="this.parentElement.textContent='${initials.toUpperCase()}'"></div>`
      : `<div class="teacher-avatar">${initials.toUpperCase()}</div>`;
    return `
      <div class="teacher-card">
        ${avatarHtml}
        <div class="teacher-name">${d.nombres} ${d.apellidos}</div>
        <div class="teacher-area">${d.codigo} · ${d.area}</div>
        <div class="teacher-email">✉️ ${d.email}</div>
        <div style="margin-bottom:12px"><span class="badge badge-blue">${nc} curso${nc !== 1 ? 's' : ''}</span></div>
        <div class="teacher-actions">
          <button class="btn btn-secondary btn-sm" onclick="viewDocente('${d.id}')">👁️</button>
          <button class="btn btn-secondary btn-sm" onclick="openModalDocente('${d.id}')">✏️</button>
          <button class="btn btn-danger btn-sm"    onclick="confirmDelete('docente','${d.id}')">🗑️</button>
        </div>
      </div>`;
  }).join('');
}