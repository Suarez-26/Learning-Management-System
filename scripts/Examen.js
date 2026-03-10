

/* TODA LA GESTION DE ESTUDIANTES  */
/* ---- RENDER ---- */

function renderCursos() {
    const q = (document.getElementById('search-cursos')?.value || '').toLowerCase();
    const cursos   = LS.get('cursos').filter(c =>
      (c.nombre + ' ' + c.codigo + ' ' + c.descripcion).toLowerCase().includes(q)
    );
    const curso = LS.get('curso');
    const grid     = document.getElementById('estudiantes-grid');
  
    if (!cursos.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">📚</div><p>No hay cursos registrados</p>
      </div>`;
      return;
    }
  
    grid.innerHTML = cursos.map((c, i) => {
      const b   = BANNERS[i % BANNERS.length];
      const doc = curso.find(d => d.id === c.estudianteId);
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




  function renderGestionEstudiantes() {
    const q = (
      document.getElementById('search-estudiante')?.value ||
      document.getElementById('search-estudiante2')?.value || ''
    ).toLowerCase();
  
    const docs   = LS.get('estudiante').filter(d =>
      (d.nombres + ' ' + d.apellidos + ' ' + d.codigo + ' ' + d.area + ' ' + d.email)
        .toLowerCase().includes(q)
    );
    const cursos = LS.get('cursos');
  
    _renderEstudianteGrid(docs, cursos);
    _renderDocentesTable(docs, cursos);
  }
  
  function _renderEstudianteGrid(docs, cursos) {
    const grid = document.getElementById('estudiante-grid');
    if (!docs.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">👨‍🏫</div><p>No hay modulos registrados registrados</p>
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
  