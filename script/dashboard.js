/* =====================================================
   LMS ABC — dashboard.js
   Estadísticas y widgets del Dashboard
   ===================================================== */

const DASH_COLORS = ['#6c63ff', '#ff6584', '#43e97b', '#f7b731'];

function updateDashboard() {
  const cursos   = LS.get('cursos');
  const docentes = LS.get('docentes');
  const modulos  = LS.get('modulos');
  const admins   = LS.get('admins');

  // Estadísticas
  document.getElementById('stat-cursos').textContent   = cursos.length;
  document.getElementById('stat-docentes').textContent = docentes.length;
  document.getElementById('stat-modulos').textContent  = modulos.length;
  document.getElementById('stat-admins').textContent   = admins.length;

  // Cursos recientes
  const rc = document.getElementById('recent-courses');
  rc.innerHTML = cursos.slice(-4).reverse().map((c, i) =>
    `<li class="recent-item">
      <div class="recent-dot" style="background:${DASH_COLORS[i % 4]}"></div>
      <div>${c.nombre}</div>
      <div style="margin-left:auto;font-size:11px;color:var(--text3)">${c.codigo}</div>
    </li>`
  ).join('') || '<li class="recent-item" style="color:var(--text3)">Sin cursos aún</li>';

  // Docentes recientes
  const rt = document.getElementById('recent-teachers');
  rt.innerHTML = docentes.slice(-4).reverse().map((d, i) =>
    `<li class="recent-item">
      <div class="recent-dot" style="background:${DASH_COLORS[i % 4]}"></div>
      <div>${d.nombres} ${d.apellidos}</div>
      <div style="margin-left:auto"><span class="badge badge-blue">${d.area}</span></div>
    </li>`
  ).join('') || '<li class="recent-item" style="color:var(--text3)">Sin docentes aún</li>';

  // Áreas académicas
  const areaCount = {};
  docentes.forEach(d => { areaCount[d.area] = (areaCount[d.area] || 0) + 1; });
  const al = document.getElementById('areas-list');
  al.innerHTML = Object.entries(areaCount).map(([area, count], i) =>
    `<li class="recent-item">
      <div class="recent-dot" style="background:${DASH_COLORS[i % 4]}"></div>
      <div>${area}</div>
      <div style="margin-left:auto;font-size:12px;color:var(--text2)">${count} docente${count > 1 ? 's' : ''}</div>
    </li>`
  ).join('') || '<li class="recent-item" style="color:var(--text3)">Sin datos</li>';
}
