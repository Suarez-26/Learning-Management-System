let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
let currentDocenteId = null;

// Referencias DOM
const teacherList = document.getElementById('teacherList');
const teacherForm = document.getElementById('teacherForm');

// Inicializar
document.addEventListener('DOMContentLoaded', renderTeachers);

// Abrir/Cerrar Modales
document.getElementById('openAddModal').onclick = () => document.getElementById('modalAdd').style.display = 'block';
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// Añadir Docente
teacherForm.onsubmit = (e) => {
    e.preventDefault();
    const newTeacher = {
        id: document.getElementById('docId').value,
        photo: document.getElementById('photo').value || 'https://via.placeholder.com/40',
        names: document.getElementById('names').value,
        lastnames: document.getElementById('lastnames').value,
        email: document.getElementById('email').value,
        area: document.getElementById('area').value
    };

    teachers.push(newTeacher);
    saveAndRender();
    teacherForm.reset();
    closeModal('modalAdd');
};

// Guardar en LocalStorage y Dibujar Tabla
function saveAndRender() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    renderTeachers();
}

function renderTeachers() {
    teacherList.innerHTML = '';
    teachers.forEach((t, index) => {
        teacherList.innerHTML += `
            <tr>
                <td><img src="${t.photo}" class="td-photo" width="35"></td>
                <td>${t.id}</td>
                <td>${t.names}</td>
                <td>${t.lastnames}</td>
                <td>${t.email}</td>
                <td>${t.area}</td>
                <td class="actions-cell">
                    <i class="fa-solid fa-ellipsis-vertical drop-btn" onclick="toggleMenu(${index})"></i>
                    <div id="menu-${index}" class="dropdown-menu">
                        <button onclick="confirmAction('reasignar', ${index})"><i class="fa-solid fa-rotate"></i> Reasignar Grupo</button>
                        <button onclick="confirmAction('eliminar', ${index})" style="color:red"><i class="fa-solid fa-trash"></i> Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Menú desplegable de los tres puntos
function toggleMenu(index) {
    const menus = document.querySelectorAll('.dropdown-menu');
    menus.forEach((m, i) => m.style.display = (i === index && m.style.display !== 'block') ? 'block' : 'none');
}

// Ventana Flotante de Confirmación
function confirmAction(type, index) {
    currentDocenteId = index;
    const modal = document.getElementById('modalConfirm');
    const title = document.getElementById('confirmTitle');
    const text = document.getElementById('confirmText');
    const btn = document.getElementById('btnActionConfirm');

    modal.style.display = 'block';

    if (type === 'eliminar') {
        title.innerText = "Eliminar Docente";
        text.innerText = "¿Estás seguro de que deseas eliminar este registro?";
        btn.onclick = () => {
            teachers.splice(currentDocenteId, 1);
            saveAndRender();
            closeModal('modalConfirm');
        };
    } else {
        title.innerText = "Reasignar Grupo";
        text.innerText = "¿Deseas reasignar a este docente a un nuevo grupo?";
        btn.onclick = () => {
            alert("Grupo reasignado con éxito (Lógica de negocio)");
            closeModal('modalConfirm');
        };
    }
}

// Cerrar menús al hacer clic fuera
window.onclick = (event) => {
    if (!event.target.matches('.drop-btn')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
    }
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
};