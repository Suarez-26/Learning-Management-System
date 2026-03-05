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

function _renderDocentesTable(docs, cursos) {
  const tbody = document.getElementById('docentes-table-body');
  tbody.innerHTML = docs.map(d => {
    const nc = cursos.filter(c => c.docenteId === d.id).length;
    return `<tr>
      <td>${d.codigo}</td>
      <td>${d.identificacion}</td>
      <td><strong>${d.nombres} ${d.apellidos}</strong></td>
      <td>${d.email}</td>
      <td><span class="badge badge-blue">${d.area}</span></td>
      <td>${nc} curso${nc !== 1 ? 's' : ''}</td>
      <td><div class="td-actions">
        <button class="btn btn-secondary btn-sm" onclick="viewDocente('${d.id}')">👁️</button>
        <button class="btn btn-secondary btn-sm" onclick="openModalDocente('${d.id}')">✏️</button>
        <button class="btn btn-danger btn-sm"    onclick="confirmDelete('docente','${d.id}')">🗑️</button>
      </div></td>
    </tr>`;
  }).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text3);padding:32px">Sin resultados</td></tr>';
}

/* ---- MODAL ---- */

function openModalDocente(id) {
  editDocenteId = id || null;
  document.getElementById('modal-docente-title').textContent = id ? 'Editar Docente' : 'Nuevo Docente';

  // Limpiar campos
  ['codigo','id','nombres','apellidos','email','foto','area'].forEach(f => {
    const el = document.getElementById('d-' + f);
    if (el) el.value = '';
  });

  if (id) {
    const d = LS.get('docentes').find(x => x.id === id);
    if (d) {
      document.getElementById('d-codigo').value    = d.codigo;
      document.getElementById('d-id').value        = d.identificacion;
      document.getElementById('d-nombres').value   = d.nombres;
      document.getElementById('d-apellidos').value = d.apellidos;
      document.getElementById('d-email').value     = d.email;
      document.getElementById('d-foto').value      = d.foto || '';
      document.getElementById('d-area').value      = d.area;
    }
  }
  openModal('modal-docente');
}

function saveDocente() {
  const codigo        = document.getElementById('d-codigo').value.trim();
  const identificacion = document.getElementById('d-id').value.trim();
  const nombres       = document.getElementById('d-nombres').value.trim();
  const apellidos     = document.getElementById('d-apellidos').value.trim();
  const email         = document.getElementById('d-email').value.trim();
  const foto          = document.getElementById('d-foto').value.trim();
  const area          = document.getElementById('d-area').value;

  if (!codigo || !identificacion || !nombres || !apellidos || !email || !area) {
    toast('Completa todos los campos obligatorios', 'error');
    return;
  }

  const docs = LS.get('docentes');
  if (editDocenteId) {
    const idx = docs.findIndex(d => d.id === editDocenteId);
    if (idx !== -1) docs[idx] = { ...docs[idx], codigo, identificacion, nombres, apellidos, email, foto, area };
  } else {
    docs.push({ id: codigo, codigo, identificacion, nombres, apellidos, email, foto, area });
  }

  LS.set('docentes', docs);
  closeModal('modal-docente');
  renderDocentes();
  updateDashboard();
  toast(editDocenteId ? 'Docente actualizado ✅' : 'Docente creado ✅', 'success');
  editDocenteId = null;
}