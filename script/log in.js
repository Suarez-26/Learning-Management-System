// Inicializar datos por defecto
Auth.initDefaultData();

// Si ya está autenticado, redirigir al dashboard
if (Auth.isAuthenticated()) {
    window.location.href = 'dashboard.html';
}

// Toggle mostrar/ocultar contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Manejar envío del formulario
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Validar campos vacíos
    if (!email || !password) {
        errorDiv.textContent = 'Por favor, completa todos los campos';
        errorDiv.classList.add('show');
        return;
    }

    // Intentar login
    const result = Auth.login(email, password);

    if (result.success) {
        errorDiv.classList.remove('show');
        window.location.href = 'dashboard.html';
    } else {
        errorDiv.textContent = result.message || 'Credenciales inválidas';
        errorDiv.classList.add('show');
    }
});

// Remover mensaje de error al escribir
document.getElementById('email').addEventListener('input', function() {
    document.getElementById('loginError').classList.remove('show');
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('loginError').classList.remove('show');
});