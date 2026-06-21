/* ==========================================================================
   NEXOLION STUDIO - LÓGICA DE INTERFAZ & MODO OSCURO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DE CAMBIO DE TEMA (CLARO/OSCURO) ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // 1. Verificar preferencia guardada en localStorage o del sistema
    const currentTheme = localStorage.getItem('theme');
    
    // Función para aplicar tema oscuro
    const enableDarkMode = () => {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.innerText = 'light_mode'; // Cambiar icono a sol
        localStorage.setItem('theme', 'dark');
    };

    // Función para aplicar tema claro
    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.innerText = 'dark_mode'; // Cambiar icono a luna
        localStorage.setItem('theme', 'light');
    };

    // 2. Aplicar tema inicial
    if (currentTheme === 'dark') {
        enableDarkMode();
    } else if (currentTheme === 'light') {
        disableDarkMode();
    } else {
        // Si no hay preferencia guardada, verificar el sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    // 3. Manejar clic en el botón de tema
    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

});