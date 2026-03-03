// Inicializar iconos de Lucide
lucide.createIcons();

// Dropdown de perfil
const profileBtn = document.getElementById('profileDropdown');
const dropdown = document.querySelector('.dropdown-menu');

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
});

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', () => {
    dropdown.style.display = 'none';
});
