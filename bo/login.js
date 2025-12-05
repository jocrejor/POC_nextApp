document.addEventListener('DOMContentLoaded', function() {
    // Inicialitzar localStorage amb usuaris del array User si no existeix
    function inicialitzarUsuaris() {
        const usuarisGuardats = localStorage.getItem('usuaris');
        
        if (!usuarisGuardats && typeof User !== 'undefined') {
            // Copiar l'array User de WebCorporativaDades.js a localStorage
            localStorage.setItem('usuaris', JSON.stringify(User));
            console.log('Usuaris inicialitzats des de l\'array User');
        } else if (!usuarisGuardats) {
            // Si no hi ha array User, crear un array buit
            localStorage.setItem('usuaris', JSON.stringify([]));
            console.log('Array d\'usuaris buit creat');
        }
    }
    
    // Obtenir usuaris de localStorage
    function obtenirUsuaris() {
        const usuarisJSON = localStorage.getItem('usuaris');
        return usuarisJSON ? JSON.parse(usuarisJSON) : [];
    }
    
    // Guardar usuaris a localStorage
    function guardarUsuaris(usuaris) {
        localStorage.setItem('usuaris', JSON.stringify(usuaris));
    }
    
    // Verificar credencials
    function verificarUsuari(email, contrasenya) {
        const usuaris = obtenirUsuaris();
        return usuaris.find(u => 
            u.email === email && 
            u.password === contrasenya
        );
    }
    
    // Comprovar si l'email ja existeix
    function emailExisteix(email) {
        const usuaris = obtenirUsuaris();
        return usuaris.some(u => u.email === email);
    }
    
    // Validar format d'email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Afegir nou usuari
    function afegirNouUsuari(nom, email, contrasenya) {
        const usuaris = obtenirUsuaris();
        
        // Obtenir el següent ID disponible
        const maxId = usuaris.reduce((max, u) => Math.max(max, u.id || 0), 0);
        
        const nouUsuari = {
            id: maxId + 1,
            name: nom,
            password: contrasenya, // En producció, això hauria d'estar hash
            email: email
        };
        
        usuaris.push(nouUsuari);
        guardarUsuaris(usuaris);
        return true;
    }
    
    // Netejar missatges
    function netejarMissatges() {
        document.getElementById('missatgeError').textContent = '';
        document.getElementById('missatgeExit').textContent = '';
    }
    
    // Mostrar missatge d'error
    function mostrarError(missatge) {
        netejarMissatges();
        document.getElementById('missatgeError').textContent = missatge;
    }
    
    // Mostrar missatge d'èxit
    function mostrarExit(missatge) {
        netejarMissatges();
        document.getElementById('missatgeExit').textContent = missatge;
    }
    
    // Inicialitzar usuaris al carregar la pàgina
    inicialitzarUsuaris();
    
    // Gestionar formulari de login
    const formulariLogin = document.getElementById('formulariLogin');
    if (formulariLogin) {
        formulariLogin.addEventListener('submit', function(event) {
            event.preventDefault();
            netejarMissatges();
            
            const email = document.getElementById('email').value.trim();
            const contrasenya = document.getElementById('contrasenya').value;
            
            // Validar format de l'email
            if (!validarEmail(email)) {
                mostrarError('Format de correu electrònic invàlid.');
                return;
            }
            const regexcontrasenya = /^.{5,20}$/;
            if (!regexcontrasenya.test(contrasenya)) {
                mostrarError('La contrasenya ha de tenir entre 5 i 20 caràcters.');
                return;
            }
            
            // Verificar credencials contra localStorage
            const usuariTrobat = verificarUsuari(email, contrasenya);
            
            if (usuariTrobat) {
                // Guardar informació de sessió
                sessionStorage.setItem('usuariActual', JSON.stringify({
                    id: usuariTrobat.id,
                    name: usuariTrobat.name,
                    email: usuariTrobat.email,
                    rol:usuariTrobat.rol
                }));
                
                mostrarExit('Inici de sessió correcte! Redirigint...');
                
                // Redirigir després d'un petit delay
                setTimeout(() => {
                    window.location.href = 'dashboard/dashboard.html';
                }, 1000);
            } else {
                mostrarError('Correu electrònic o contrasenya incorrectes.');
            }
        });
    }
    
    
});


// Funció per verificar si l'usuari està autenticat (per usar en altres pàgines)
function verificarSessio() {
    const usuariActual = sessionStorage.getItem('usuariActual');
    if (!usuariActual) {
        window.location.href = '/login.html';
        return false;
    }
    return JSON.parse(usuariActual);
}

// Funció per tancar sessió
function tancarSessio() {
    sessionStorage.removeItem('usuariActual');
    window.location.href = '/login.html'; 
}