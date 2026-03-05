/* =====================================================
   LMS ABC — auth.js
   Autenticación y navegación entre páginas
   ===================================================== */

let currentUser = null;

/* ---- AUTH ---- */

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const admins = LS.get('admins');
  const found  = admins.find(a => a.email === email && a.pass === pass);

  if (found) {
    currentUser = found;
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('sidebar-name').textContent   = found.nombres + ' ' + found.apellidos;
    document.getElementById('sidebar-avatar').textContent = (found.nombres[0] || 'A').toUpperCase();
    showApp();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function logout() {
  currentUser = null;
  showLogin();
}

/* ---- PAGE NAVIGATION ---- */

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
}

function showLogin()  { showPage('login'); }

function showPublic() {
  renderPublicCourses();
  showPage('public');
}

function showApp() {
  showPage('app');
  updateDashboard();
  renderDocentes();
  renderCursos();
  renderAdmins();
  populateCursoSelect();
}

/* HASTA AQUI */

/* ---- SECTION NAVIGATION ---- */

function showSection(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    docentes:  'Gestión de Docentes',
    cursos:    'Gestión de Cursos',
    admins:    'Administrativos',
  };
  document.getElementById('topbar-title').textContent = titles[name] || name;

  const actions = document.getElementById('topbar-actions');
  actions.innerHTML = '';
  if (name === 'docentes') {
    actions.innerHTML = '<button class="btn btn-primary btn-sm" onclick="openModalDocente()">➕ Nuevo Docente</button>';
  } else if (name === 'cursos') {
    actions.innerHTML = '<button class="btn btn-primary btn-sm" onclick="openModalCurso()">➕ Nuevo Curso</button>';
  } else if (name === 'admins') {
    actions.innerHTML = '<button class="btn btn-primary btn-sm" onclick="openModalAdmin()">➕ Nuevo Administrativo</button>';
  }
}

/* ---- TABS ---- */

function switchTab(section, tab, el) {
  const container = document.getElementById('section-' + section);
  container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + section + '-' + tab).classList.add('active');
  el.classList.add('active');
  if (section === 'cursos' && tab === 'modulos') {
    populateCursoSelect();
    renderModulos();
  }
}

/* ---- MODAL HELPERS ---- */

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ---- TOAST ---- */

function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast ' + type + ' show';
  setTimeout(() => el.classList.remove('show'), 3200);
}

/* ---- KEYBOARD & OVERLAY ---- */

document.addEventListener('DOMContentLoaded', () => {
  // Enter key para login
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('page-login').classList.contains('active')) {
      doLogin();
    }
  });

  // Cerrar modal al hacer click fuera
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // Init
  initData();
  showPublic();
});
