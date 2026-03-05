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