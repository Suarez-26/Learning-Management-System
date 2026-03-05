/* =====================================================
   LMS ABC — admins.js
   CRUD completo de Administrativos
   ===================================================== */

let editAdminId = null;

/* ---- RENDER ---- */

function renderAdmins() {
  const q = (document.getElementById('search-admins')?.value || '').toLowerCase();
  const admins = LS.get('admins').filter(a =>
    (a.nombres + ' ' + a.apellidos + ' ' + a.email + ' ' + a.cargo).toLowerCase().includes(q)
  );
  const tbody = document.getElementById('admins-table-body');
  tbody.innerHTML = admins.map(a => `
    <tr>
      <td>${a.identificacion}</td>
      <td><strong>${a.nombres} ${a.apellidos}</strong></td>
      <td>${a.email}</td>
      <td>${a.telefono || '—'}</td>
      <td><span class="badge badge-yellow">${a.cargo}</span></td>
      <td><div class="td-actions">
        <button class="btn btn-secondary btn-sm" onclick="openModalAdmin('${a.id}')">✏️</button>
        <button class="btn btn-danger btn-sm"    onclick="confirmDelete('admin','${a.id}')">🗑️</button>
      </div></td>
    </tr>`).join('') ||
    '<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:32px">Sin administrativos</td></tr>';
}

/* ---- MODAL ---- */

function openModalAdmin(id) {
  editAdminId = id || null;
  document.getElementById('modal-admin-title').textContent = id ? 'Editar Administrativo' : 'Nuevo Administrativo';
  ['id', 'nombres', 'apellidos', 'email', 'pass', 'tel', 'cargo'].forEach(f => {
    const el = document.getElementById('a-' + f);
    if (el) el.value = '';
  });
  if (id) {
    const a = LS.get('admins').find(x => x.id === id);
    if (a) {
      document.getElementById('a-id').value       = a.identificacion;
      document.getElementById('a-nombres').value  = a.nombres;
      document.getElementById('a-apellidos').value = a.apellidos;
      document.getElementById('a-email').value    = a.email;
      document.getElementById('a-pass').value     = a.pass;
      document.getElementById('a-tel').value      = a.telefono || '';
      document.getElementById('a-cargo').value    = a.cargo;
    }
  }
  openModal('modal-admin');
}

function saveAdmin() {
  const identificacion = document.getElementById('a-id').value.trim();
  const nombres        = document.getElementById('a-nombres').value.trim();
  const apellidos      = document.getElementById('a-apellidos').value.trim();
  const email          = document.getElementById('a-email').value.trim();
  const pass           = document.getElementById('a-pass').value;
  const telefono       = document.getElementById('a-tel').value.trim();
  const cargo          = document.getElementById('a-cargo').value;

  if (!identificacion || !nombres || !apellidos || !email || !pass || !cargo) {
    toast('Completa todos los campos obligatorios', 'error');
    return;
  }

  const admins = LS.get('admins');
  if (editAdminId) {
    const idx = admins.findIndex(a => a.id === editAdminId);
    if (idx !== -1) admins[idx] = { ...admins[idx], identificacion, nombres, apellidos, email, pass, telefono, cargo };
  } else {
    admins.push({ id: 'ADM-' + Date.now(), identificacion, nombres, apellidos, email, pass, telefono, cargo });
  }

  LS.set('admins', admins);
  closeModal('modal-admin');
  renderAdmins();
  updateDashboard();
  toast(editAdminId ? 'Administrativo actualizado ✅' : 'Administrativo creado ✅', 'success');
  editAdminId = null;
}
