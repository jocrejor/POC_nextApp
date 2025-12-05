//Variables paginació
let paginaActual = 1;
const usuarisPerPagina = 10; 
document.addEventListener("DOMContentLoaded", function() {
    // Inicialitzar localStorage amb usuaris si no existeix
    inicialitzarUsuaris();
    
    // Carregar i mostrar usuaris
    llistaUsuaris();
    
    // Afegir event listeners
    configurarEventListeners();
});

// Inicialitzar usuaris desde l'array User
function inicialitzarUsuaris() {
    const sessioiniciada = sessionStorage.getItem("usuariActual");
    const usuarisGuardats = localStorage.getItem("usuaris");

    if (!usuarisGuardats) {
        // Si localStorage està buit, copiar l'array User si existeix
        if (typeof User !== 'undefined' && User) {
            localStorage.setItem("usuaris", JSON.stringify(User));
            console.log("Usuaris inicialitzats des de l'array User");
        } else {
            // Si no hi ha array User, crear array buit
            localStorage.setItem("usuaris", JSON.stringify([]));
            console.log("Array d'usuaris buit creat");
        }
    }
}

// Obtenir usuaris de localStorage
function obtenirUsuaris() {
    const usuarisJSON = localStorage.getItem("usuaris");
    return usuarisJSON ? JSON.parse(usuarisJSON) : [];
}

// Guardar usuaris a localStorage
function guardarUsuaris(usuaris) {
    localStorage.setItem("usuaris", JSON.stringify(usuaris));
}

// Llistar tots els usuaris a la taula
// Llistar tots els usuaris a la taula amb paginació
function llistaUsuaris() {
    const usuaris = obtenirUsuaris();
    const tbody = document.getElementById("llistaUsuaris");
    const divSenseUsuaris = document.getElementById("senseUsuaris");
    const contadorUsuaris = document.getElementById("totalUsuaris");
    
    // Actualitzar contador total
    contadorUsuaris.textContent = usuaris.length;
    
    // Netejar taula
    tbody.innerHTML = "";
    
    if (usuaris.length === 0) {
        // Mostrar missatge si no hi ha usuaris
        divSenseUsuaris.style.display = "block";
        document.getElementById("taulaUsuaris").style.display = "none";
        document.querySelector(".botons-paginacio").style.display = "none";
    } else {
        // Ocultar missatge i mostrar taula
        divSenseUsuaris.style.display = "none";
        document.getElementById("taulaUsuaris").style.display = "table";
        document.querySelector(".botons-paginacio").style.display = "block";
        
        // Calcular índexs per a la paginació
        const indexInicial = (paginaActual - 1) * usuarisPerPagina;
        const indexFinal = indexInicial + usuarisPerPagina;
        const usuarisPagina = usuaris.slice(indexInicial, indexFinal);
        
        // Afegir cada usuari de la pàgina actual a la taula
        usuarisPagina.forEach((usuari, indexRelativa) => {
            const indexAbsoluta = indexInicial + indexRelativa;
            const fila = document.createElement("tr");
            
            // Crear cel·les
            const tdId = document.createElement("td");
            tdId.textContent = usuari.id;
            
            const tdNom = document.createElement("td");
            tdNom.textContent = usuari.name || usuari.nom || '';
            
            const tdEmail = document.createElement("td");
            tdEmail.textContent = usuari.email || '';
            
            const tdRol = document.createElement("td");
            tdRol.textContent = usuari.rol || '';
            
            const tdAccions = document.createElement("td");
            const divAccions = document.createElement("div");
            divAccions.className = "accions";
            
            // Crear botons amb data attributes (usar índex absolut)
            const btnEditar = document.createElement("button");
            btnEditar.className = "btn-editar";
            btnEditar.textContent = "Editar";
            btnEditar.dataset.index = indexAbsoluta;
            
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn-eliminar";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.dataset.index = indexAbsoluta;
            
            divAccions.appendChild(btnEditar);
            divAccions.appendChild(btnEliminar);
            tdAccions.appendChild(divAccions);
            
            // Afegir cel·les a la fila
            fila.appendChild(tdId);
            fila.appendChild(tdNom);
            fila.appendChild(tdEmail);
            fila.appendChild(tdRol);
            fila.appendChild(tdAccions);
            
            tbody.appendChild(fila);
        });
        
        // Actualitzar controls de paginació
        actualitzarControlsPaginacio(usuaris.length);
    }
}

// Configurar event listeners
function configurarEventListeners() {
    const formulari = document.getElementById("formulariUsuari");
    const btnCancelar = document.getElementById("btnCancelar");
    const tbody = document.getElementById("llistaUsuaris");
    const botoAnterior = document.getElementById('botoAnterior');
    const botoSeguent = document.getElementById('botoSeguent');
    const textMostrant = document.getElementById('textMostrant');
    //Eventlisteners per a paginació
    botoAnterior.addEventListener('click', () => {
        paginaAnterior();

    });
    botoSeguent.addEventListener('click', () => {
        paginaSeguent();

    });    
    // Submit del formulari
    formulari.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const index = parseInt(document.getElementById("indexUsuari").value);
        
        if (index === -1) {
            afegirUsuari();
        } else {
            actualitzarUsuari(index);
        }
    });
    
    // Botó cancel·lar
    btnCancelar.addEventListener("click", function() {
        cancelarEdicio();
    });
    
    // Event delegation per als botons de la taula
    tbody.addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-editar")) {
            const index = parseInt(e.target.dataset.index);
            editarUsuari(index);
        } else if (e.target.classList.contains("btn-eliminar")) {
            const index = parseInt(e.target.dataset.index);
            eliminarUsuari(index);
        }
    });
    
    // Event listener per al botó de tancar sessió si existeix
    const btnTancarSessio = document.getElementById("btnTancarSessio");
    if (btnTancarSessio) {
        btnTancarSessio.addEventListener("click", function() {
            tancarSessio();
        });
    }
}

// Afegir nou usuari
function afegirUsuari() {
    const nom = document.getElementById("nomUsuari").value.trim();
    const email = document.getElementById("emailUsuari").value.trim();
    const password = document.getElementById("passwordUsuari").value;
    const rol = document.getElementById("rolUsuari").value;
    
    // Validacions
    if (!validarFormulari(nom, email, password, rol)) {
        return;
    }
    
    // Comprovar si l'email ja existeix
    const usuaris = obtenirUsuaris();
    if (usuaris.some(u => u.email === email)) {
        mostrarError("Aquest correu electrònic ja està registrat.");
        return;
    }
    
    // Obtenir el següent ID, traguent el id màxim amb reduce
    const maxId = usuaris.reduce((max, u) => Math.max(max, u.id || 0), 0);
    
    // Crear nou usuari
    const nouUsuari = {
        id: maxId + 1,
        name: nom,
        password: password,
        email: email,
        rol: rol
    };
    
    // Afegir a l'array i guardar
    usuaris.push(nouUsuari);
    guardarUsuaris(usuaris);
    
    // Actualitzar UI
    llistaUsuaris();
    netejarFormulari();
    mostrarExit("Usuari afegit correctament!");
}

// Editar usuari existent
function editarUsuari(index) {
    const usuaris = obtenirUsuaris();
    const usuari = usuaris[index];
    
    if (!usuari) return;
    
    // Omplir formulari amb dades de l'usuari
    document.getElementById("indexUsuari").value = index;
    document.getElementById("nomUsuari").value = usuari.name || usuari.nom || '';
    document.getElementById("emailUsuari").value = usuari.email || '';
    document.getElementById("passwordUsuari").value = usuari.password || '';
    document.getElementById("rolUsuari").value = usuari.rol || '';
    
    // Canviar títol i botons
    document.getElementById("titolFormulari").textContent = "Editar Usuari";
    document.getElementById("btnAfegir").style.display = "none";
    document.getElementById("btnActualitzar").style.display = "inline-block";
    document.getElementById("btnCancelar").classList.remove("ocult");
    
    // Scroll al formulari
    document.querySelector(".formulari-usuari").scrollIntoView({ behavior: 'smooth' });
    
    // Focus al primer camp
    document.getElementById("nomUsuari").focus();
}

// Actualitzar usuari
function actualitzarUsuari(index) {
    const nom = document.getElementById("nomUsuari").value.trim();
    const email = document.getElementById("emailUsuari").value.trim();
    const password = document.getElementById("passwordUsuari").value;
    const rol = document.getElementById("rolUsuari").value;
    
    // Validacions
    if (!validarFormulari(nom, email, password, rol)) {
        return;
    }
    
    const usuaris = obtenirUsuaris();
    
    // Comprovar si l'email ja existeix en un altre usuari
    const emailExistent = usuaris.some((u, i) => i !== index && u.email === email);
    if (emailExistent) {
        mostrarError("Aquest correu electrònic ja està en ús per un altre usuari.");
        return;
    }
    
    // Actualitzar usuari mantenint l'ID original
    usuaris[index] = {
        ...usuaris[index],
        name: nom,
        email: email,
        password: password,
        rol: rol
    };
    
    // Guardar canvis
    guardarUsuaris(usuaris);
    
    // Actualitzar UI
    llistaUsuaris();
    cancelarEdicio();
    mostrarExit("Usuari actualitzat correctament!");
}

// Eliminar usuari
function eliminarUsuari(index) {
    // Confirmació abans d'eliminar
    if (!confirm("Estàs segur que vols eliminar aquest usuari?")) {
        return;
    }
    
    const usuaris = obtenirUsuaris();
    const usuariEliminat = usuaris[index];
    
    // Eliminar usuari de l'array
    usuaris.splice(index, 1);
    
    // Guardar canvis
    guardarUsuaris(usuaris);
    
    // Actualitzar UI
    llistaUsuaris();
    mostrarExit(`Usuari "${usuariEliminat.name || usuariEliminat.email}" eliminat correctament.`);
}

// Cancel·lar edició
function cancelarEdicio() {
    netejarFormulari();
    
    // Restaurar títol i botons
    document.getElementById("titolFormulari").textContent = "Afegir Nou Usuari";
    document.getElementById("btnAfegir").style.display = "inline-block";
    document.getElementById("btnActualitzar").style.display = "none";
    document.getElementById("btnCancelar").classList.add("ocult");
}
// Actualitzar controls de paginació
function actualitzarControlsPaginacio(totalUsuaris) {
    const totalPagines = Math.ceil(totalUsuaris / usuarisPerPagina);
    const botoAnterior = document.getElementById('botoAnterior');
    const botoSeguent = document.getElementById('botoSeguent');
    const textMostrant = document.querySelector('.botons-paginacio p');
    
    // Calcular rang d'usuaris mostrats
    const indexInicial = (paginaActual - 1) * usuarisPerPagina + 1;
    const indexFinal = Math.min(paginaActual * usuarisPerPagina, totalUsuaris);
    
    // Actualitzar text informatiu
    textMostrant.textContent = `S'estan mostrant ${indexInicial}-${indexFinal} de ${totalUsuaris}`;
    
    // Habilitar/deshabilitar botons
    botoAnterior.disabled = paginaActual === 1;
    botoSeguent.disabled = paginaActual >= totalPagines;
}

// Anar a pàgina anterior
function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        llistaUsuaris();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Anar a pàgina següent
function paginaSeguent() {
    const usuaris = obtenirUsuaris();
    //Traguem matemàticament el total de pàgines que es generen
    const totalPagines = Math.ceil(usuaris.length / usuarisPerPagina);
    
    if (paginaActual < totalPagines) {
        paginaActual++;
        llistaUsuaris();
        //Portem l'usuari dalt de tot
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Netejar formulari
function netejarFormulari() {
    document.getElementById("formulariUsuari").reset();
    document.getElementById("indexUsuari").value = "-1";
    netejarMissatges();
}

// Validar formulari
function validarFormulari(nom, email, password, rol) {
    // Validar nom
    if (nom.length < 2) {
        mostrarError("El nom ha de tenir almenys 2 caràcters.");
        return false;
    }
    
    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        mostrarError("Format de correu electrònic invàlid.");
        return false;
    }
    
    // Validar password - 
    const regexcontrasenya = /^.{8,20}$/;
    if (!regexcontrasenya.test(password)) {
        mostrarError("La contrasenya ha de tenir entre 8 i 20 caràcters.");
        return false;
    }
    
    // Validar rol 
    if (rol !== "admin" && rol !== "editor") {
        mostrarError("No ha assignat cap rol vàlid al usuari");
        return false;
    }
    
    return true;
}

// Mostrar missatge d'error
function mostrarError(missatge) {
    netejarMissatges();
    const divError = document.getElementById("missatgeError");
    divError.textContent = missatge;
    divError.style.display = "block";
    
    // Ocultar després de 5 segons
    setTimeout(() => {
        divError.style.display = "none";
    }, 5000);
}

// Mostrar missatge d'èxit
function mostrarExit(missatge) {
    netejarMissatges();
    const divExit = document.getElementById("missatgeExit");
    divExit.textContent = missatge;
    divExit.style.display = "block";
    
    // Ocultar després de 3 segons
    setTimeout(() => {
        divExit.style.display = "none";
    }, 3000);
}

// Netejar missatges
function netejarMissatges() {
    document.getElementById("missatgeError").style.display = "none";
    document.getElementById("missatgeExit").style.display = "none";
}

// Tancar Sessió
function tancarSessio() {
    sessionStorage.clear();
    window.location.href = '../login.html';
}