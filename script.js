document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN DE FIREBASE ---
    // **IMPORTANTE**: Reemplaza este objeto con tus propias credenciales de Firebase.
    // Puedes obtenerlas desde la consola de tu proyecto en Firebase.
    const firebaseConfig = {
        apiKey: "TU_API_KEY",
        authDomain: "TU_AUTH_DOMAIN",
        projectId: "TU_PROJECT_ID",
        storageBucket: "TU_STORAGE_BUCKET",
        messagingSenderId: "TU_MESSAGING_SENDER_ID",
        appId: "TU_APP_ID"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // --- SELECTORES DEL DOM ---
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close-btn');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const contentDisplayArea = document.getElementById('content-display-area');
    const contentSections = document.querySelectorAll('.content-section');

    // --- LÓGICA DE AUTENTICACIÓN ---

    // Escuchar cambios en el estado de autenticación
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuario está logueado
            console.log('Usuario logueado:', user.email);
            // Si estamos en la página de videos, no hacemos nada.
            // Si estamos en index.html, podríamos cambiar los botones de auth
            if (loginBtn && signupBtn) {
                loginBtn.classList.add('hidden');
                signupBtn.textContent = 'Ir a Videos';
                signupBtn.onclick = () => window.location.href = 'videos.html';
            }
        } else {
            // Usuario no está logueado
            console.log('No hay usuario logueado.');
            // Si estamos en la página de videos, el script de esa página ya redirige.
            // Restaurar botones en index.html si es necesario
            if (loginBtn && signupBtn) {
                loginBtn.classList.remove('hidden');
                signupBtn.textContent = 'Sign Up';
                signupBtn.onclick = () => signupModal.classList.remove('hidden');
            }
        }
    });

    // Funcionalidad de Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    console.log('Login exitoso');
                    window.location.href = 'videos.html';
                })
                .catch(error => alert(`Error en login: ${error.message}`));
        });
    }

    // Funcionalidad de Sign Up
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    console.log('Registro exitoso');
                    window.location.href = 'videos.html';
                })
                .catch(error => alert(`Error en registro: ${error.message}`));
        });
    }

    // Funcionalidad de Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log('Logout exitoso');
                window.location.href = 'index.html';
            }).catch(error => console.error('Error en logout:', error));
        });
    }

    // --- LÓGICA DE UI (MODALS, MENÚS, ANIMACIONES) ---

    // Abrir Modals
    if (loginBtn) loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    if (signupBtn) signupBtn.addEventListener('click', () => {
        // Solo abrir si no hay usuario logueado
        if (!auth.currentUser) {
            signupModal.classList.remove('hidden');
        }
    });

    // Cerrar Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
            signupModal.classList.add('hidden');
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.classList.add('hidden');
        if (e.target === signupModal) signupModal.classList.add('hidden');
    });

    // Funcionalidad de Menús Desplegables (mostrar/ocultar contenido)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = toggle.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            // Ocultar todas las secciones
            contentSections.forEach(section => section.classList.add('hidden'));

            // Mostrar la sección objetivo
            if (targetSection) {
                targetSection.classList.remove('hidden');
                // Scroll suave hacia el área de contenido
                contentDisplayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Animación de Fade-in en Scroll
    const scrollSections = document.querySelectorAll('.scroll-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    scrollSections.forEach(section => {
        observer.observe(section);
    });
});