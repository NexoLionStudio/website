/* ==========================================================================
   NEXOLION STUDIO - LÓGICA DE INTERFAZ & MODO OSCURO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DE CAMBIO DE TEMA (CLARO/OSCURO) ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    
    const enableDarkMode = () => {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.innerText = 'light_mode'; 
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.innerText = 'dark_mode'; 
        localStorage.setItem('theme', 'light');
    };

    if (currentTheme === 'dark') {
        enableDarkMode();
    } else if (currentTheme === 'light') {
        disableDarkMode();
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // --- 2. LÓGICA DEL MENÚ HAMBURGUESA (MOBILE) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const hamburgerIcon = hamburgerBtn.querySelector('.material-icons');

    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Cambiar icono de menú a "X" (close) al abrir
        if (mobileMenu.classList.contains('active')) {
            hamburgerIcon.textContent = 'close';
        } else {
            hamburgerIcon.textContent = 'menu';
        }
    });

    // Cerrar el menú automáticamente al tocar un enlace
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburgerIcon.textContent = 'menu';
        });
    });

    // --- 3. LÓGICA DEL CHATBOT FLOTANTE ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.querySelector('.chatbot-body');

    // Abrir/Cerrar la ventana
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    // Función asíncrona para enviar el mensaje a Vercel/Gemini
    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (text === '') return;

        // 1. Mostrar mensaje del usuario
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message';
        userMsg.style.backgroundColor = 'rgba(201, 160, 96, 0.1)';
        userMsg.style.borderRight = '3px solid var(--color-accent)';
        userMsg.style.textAlign = 'right';
        userMsg.style.marginLeft = '20px';
        userMsg.textContent = text;
        chatBody.appendChild(userMsg);

        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // 2. Mostrar indicador de "Escribiendo..."
        const typingMsg = document.createElement('div');
        typingMsg.className = 'chat-message bot-message';
        typingMsg.innerHTML = '<i>Escribiendo...</i>';
        chatBody.appendChild(typingMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            // 3. Llamar a nuestra API oculta
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            
            // Borrar "Escribiendo..."
            chatBody.removeChild(typingMsg);

            // 4. Mostrar respuesta de Gemini
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot-message';
            // Reemplazamos los saltos de línea de texto por etiquetas <br> de HTML
            botMsg.innerHTML = data.reply.replace(/\n/g, '<br>');
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;

        } catch (error) {
            // Manejo de errores
            chatBody.removeChild(typingMsg);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'chat-message bot-message';
            errorMsg.textContent = 'Error de conexión. Por favor, usa el formulario de soporte o escribe a nexolionstudio@gmail.com.';
            chatBody.appendChild(errorMsg);
        }
    };

    // Eventos de clic y tecla Enter
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});