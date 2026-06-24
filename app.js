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
        if (mobileMenu.classList.contains('active')) {
            hamburgerIcon.textContent = 'close';
        } else {
            hamburgerIcon.textContent = 'menu';
        }
    });

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

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (text === '') return;

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

        const typingMsg = document.createElement('div');
        typingMsg.className = 'chat-message bot-message';
        typingMsg.innerHTML = '<i>Escribiendo...</i>';
        chatBody.appendChild(typingMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            
            chatBody.removeChild(typingMsg);

            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot-message';
            botMsg.innerHTML = data.reply.replace(/\n/g, '<br>');
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;

        } catch (error) {
            chatBody.removeChild(typingMsg);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'chat-message bot-message';
            errorMsg.textContent = 'Error de conexión. Por favor, usa el formulario de soporte o escribe a nexolionstudio@gmail.com.';
            chatBody.appendChild(errorMsg);
        }
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
	
	// --- LÓGICA DEL FORMULARIO DE SOPORTE ---
    const formSoporte = document.getElementById('form-soporte');
    
    if (formSoporte) {
        formSoporte.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const btn = document.getElementById('btn-enviar');
            const btnOriginalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            fetch(formSoporte.action, {
                method: 'POST',
                body: new FormData(formSoporte),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('¡Mensaje enviado con éxito! Nos contactaremos a la brevedad.');
                    formSoporte.reset();
                } else {
                    alert('Hubo un problema al enviar el mensaje. Intenta nuevamente.');
                }
            })
            .catch(error => {
                alert('Error de conexión. Verifica tu internet e intenta nuevamente.');
            })
            .finally(() => {
                btn.innerText = btnOriginalText;
                btn.disabled = false;
            });
        });
    }	
});