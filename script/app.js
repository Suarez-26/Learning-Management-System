function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.view').forEach(s => s.style.display = 'none');
    
    // Mostrar la seleccionada
    document.getElementById(`${section}-section`).style.display = 'block';
    
    // Cambiar el título
    document.getElementById('section-title').innerText = section.toUpperCase();
}

function logout() {
    sessionStorage.clear();
    window.location.href = '../../pages/log in.html';
}

// Obtener datos iniciales
let docentes = JSON.parse(localStorage.getItem('docentes')) || [];

const formDocente = document.getElementById('formDocente');

formDocente.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoDocente = {
        codigo: document.getElementById('doc-codigo').value,
        identificacion: document.getElementById('doc-id').value,
        nombres: document.getElementById('doc-nombres').value,
        apellidos: document.getElementById('doc-apellidos').value,
        email: document.getElementById('doc-email').value,
        foto: document.getElementById('doc-foto').value,
        area: document.getElementById('doc-area').value
    };

    // Guardar en el array y actualizar LocalStorage
    docentes.push(nuevoDocente);
    localStorage.setItem('docentes', JSON.stringify(docentes));

    alert("Docente registrado con éxito");
    formDocente.reset();
    closeModal();
    renderDocentes(); // Función para actualizar la tabla
});

function renderDocentes() {
    const tabla = document.getElementById('tabla-docentes'); // Asegúrate de tener este ID en tu tabla
    tabla.innerHTML = ""; // Limpiar tabla

    docentes.forEach((doc, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${doc.codigo}</td>
                <td>${doc.nombres} ${doc.apellidos}</td>
                <td>${doc.area}</td>
                <td>
                    <button onclick="editDocente(${index})">✏️</button>
                    <button onclick="deleteDocente('${doc.codigo}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}