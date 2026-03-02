// Obtener usuarios de localStorage o crear array vacío
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// FORMULARIO LOGIN
document.getElementById("formulario-login").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("passwordLogin").value;

    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if(usuario){
        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        alert("🔰 Bienvenido " + usuario.nombre);
        // Redirigir al index.html en la raíz
        window.location.href = "../index.html";
    } else {
        alert("❌ ERROR: Email o contraseña incorrecta.");
    }
});

// FORMULARIO REGISTRO
document.getElementById("formulario-registro").addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const identificacion = document.getElementById("identificacion").value;
    const nacionalidad = document.getElementById("nacionalidad").value;
    const email = document.getElementById("emailRegistro").value;
    const telefono = document.getElementById("telefono").value;
    const password = document.getElementById("passwordRegistro").value;

    // Validar si el email ya existe
    if(usuarios.some(u => u.email === email)){
        alert("❌ ERROR: El usuario ya está registrado.");
        return;
    }

    const nuevoUsuario = { nombre, identificacion, nacionalidad, email, telefono, password };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("✅ Usuario registrado con éxito!");
    
    // Limpiar formulario
    document.getElementById("formulario-registro").reset();
});

// Función para cerrar sesión (opcional)
function logoutUsuario(){
    localStorage.removeItem("usuarioActual");
    alert("🔰 Sesión cerrada.");
    window.location.href = "../index.html"; // Ajustar ruta según ubicación
}