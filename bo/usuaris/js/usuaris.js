//Asegurem que s'ha fet login

thereIsUser("../login.html");
// Variables globals per paginació
let paginaActual = 1;
const usuarisPerPagina = 10; 
document.addEventListener("DOMContentLoaded", function() {
    // Inicialitzar usuaris des de l'API
    inicialitzarUsuaris();
    
    // Carregar i mostrar usuaris
    llistaUsuaris();
    
    // Afegir event listeners
    configurarEventListeners();
    
    // Configurar validació en temps real
    configurarValidacioTempsReal();
});

// Inicialitzar usuaris desde l'array User
async function inicialitzarUsuaris() {
    let sessioiniciada = localStorage.getItem("currentUser");

    // Netejar la sessió si conté un objecte JSON mal format
    if (sessioiniciada && (sessioiniciada.startsWith('{') || sessioiniciada.startsWith('['))) {
        try {
            sessdata = JSON.parse(sessioiniciada);
            // if you find a "name" property wrtie it to the only span
            const spanUsuari = document.getElementById("nomUsuariActiu");
            if (sessdata.name && spanUsuari) {
                spanUsuari.textContent = sessdata.name;
            }
        } catch (e) {
            console.error("Error parsejant dades de sessió", e);
        }
    }

  

    // Inicialitzar usuaris des de l'API
    // (els usuaris es carregaran sota demanda des de l'API, no es guarden localment)
}



// Obtenir usuaris des de l'API
async function obtenirUsuaris() {
    try {
        const usuaris = await getData(url, 'UserWC');
        return Array.isArray(usuaris) ? usuaris : [];
    } catch (e) {
        console.error('Error obtenint usuaris de l\'API:', e);
        return [];
    }
}

// Guardar usuaris a través de l'API 
async function guardarUsuaris(usuaris) {
    try {
        await postData(url, 'UserWC', usuaris);
        console.log('Usuaris guardats correctament a través de l\'API');
    } catch (e) {
        console.error('Error guardant usuaris a l\'API:', e);
    }
}

// Llistar tots els usuaris a la taula amb paginació
async function llistaUsuaris(pagina = 1) {
    // Obtenir usuaris des de l'API cada cop que es crida aquesta funció
    const usuaris = await obtenirUsuaris();
    const tbody = document.getElementById("llistaUsuaris");
    const divSenseUsuaris = document.getElementById("senseUsuaris");
    // Calcular paginació
    const totalPagines = Math.ceil(usuaris.length / usuarisPerPagina);
    paginaActual = pagina;
    
    // Validar pàgina
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPagines) paginaActual = totalPagines || 1;
    
    // Mostrar informació de paginació al header
    const infoPaginacio = document.getElementById("infoPaginacio");
    if (infoPaginacio) {
        if (totalPagines > 1) {
            infoPaginacio.textContent = ` | Pàgina ${paginaActual} de ${totalPagines}`;
            infoPaginacio.style.display = "inline";
        } else {
            infoPaginacio.style.display = "none";
        }
    }
    
    // Calcular índexs
    const inici = (paginaActual - 1) * usuarisPerPagina;
    const final = Math.min(inici + usuarisPerPagina, usuaris.length);
    
    // Netejar taula
    tbody.innerHTML = "";
    
    // Afegir capçalera mòbil
    const filaCapcalera = document.createElement("tr");
    filaCapcalera.className = "capcalera_movil";
    const thCapcalera = document.createElement("th");
    thCapcalera.textContent = "Llistat";
    filaCapcalera.appendChild(thCapcalera);
    tbody.appendChild(filaCapcalera);
    
    if (usuaris.length === 0) {
        // Mostrar missatge si no hi ha usuaris
        divSenseUsuaris.style.display = "block";
        document.getElementById("taula").style.display = "none";
        // Ocultar controls de paginació
        const paginacioElement = document.getElementById("paginacio");
        if (paginacioElement) {
            paginacioElement.style.display = "none";
        }
    } else {
        // Ocultar missatge i mostrar taula
        divSenseUsuaris.style.display = "none";
        document.getElementById("taula").style.display = "table";
        
        // Afegir cada usuari de la pàgina actual a la taula
        for (let i = inici; i < final; i++) {
            const usuari = usuaris[i];
            const fila = document.createElement("tr");
            
            // Crear cel·les
            const tdId = document.createElement("td");
            tdId.textContent = usuari.id;
            tdId.setAttribute("data-cell", "ID : ");
            
            const tdNom = document.createElement("td");
            tdNom.textContent = usuari.name || usuari.nom || '';
            tdNom.setAttribute("data-cell", "Nom : ");
            
            const tdEmail = document.createElement("td");
            tdEmail.textContent = usuari.email || '';
            tdEmail.setAttribute("data-cell", "Email : ");
            
            const tdRol = document.createElement("td");
            tdRol.textContent = usuari.rol || '';
            tdRol.setAttribute("data-cell", "Rol usuari : ");
            
            const tdAccions = document.createElement("td");
            tdAccions.setAttribute("data-cell", "Accions : ");
            
            // Crear botons amb data attributes (utilitzant l'ID de l'usuari)
            const btnEditar = document.createElement("a");
            btnEditar.className = "icon-editar";
            btnEditar.href = "#";
            btnEditar.onclick = function(e) {
                e.preventDefault();
                editarUsuari(usuari.id);
            };
            const iEditar = document.createElement("i");
            iEditar.className = "fa-solid fa-pen-to-square";
            btnEditar.appendChild(iEditar);
            
            const btnEliminar = document.createElement("a");
            btnEliminar.className = "icon-borrar";
            btnEliminar.href = "#";
            btnEliminar.onclick = function(e) {
                e.preventDefault();
                eliminarUsuari(usuari.id);
            };
            const iEliminar = document.createElement("i");
            iEliminar.className = "fa-solid fa-trash";
            btnEliminar.appendChild(iEliminar);
            
            tdAccions.appendChild(btnEditar);
            tdAccions.appendChild(btnEliminar);
            
            // Afegir cel·les a la fila
            fila.appendChild(tdId);
            fila.appendChild(tdNom);
            fila.appendChild(tdEmail);
            fila.appendChild(tdRol);
            fila.appendChild(tdAccions);
            
            tbody.appendChild(fila);
        }
        
        // Actualitzar controls de paginació
        actualitzarPaginacio(totalPagines);
    }
}

// Actualitzar controls de paginació
function actualitzarPaginacio(totalPagines) {
    let paginacioElement = document.getElementById("paginacio");
    
    // Si no trobem l'element, sortir
    if (!paginacioElement) {
        console.error("Element de paginació no trobat!");
        return;
    }
    
    // Netejar contingut anterior
    paginacioElement.innerHTML = "";
    
    // Només mostrar paginació si hi ha més d'una pàgina
    if (totalPagines <= 1) {
        paginacioElement.style.display = "none";
        return;
    }
    
    paginacioElement.style.display = "flex";
    
    // Botó pàgina anterior
    const btnAnterior = document.createElement("button");
    btnAnterior.className = "btn-paginacio";
    btnAnterior.innerHTML = "&laquo; Anterior";
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = async () => {
        if (paginaActual > 1) {
            await llistaUsuaris(paginaActual - 1);
        }
    };
    paginacioElement.appendChild(btnAnterior);
    
    // Crear botons de pàgines amb ellipsis
    const crearBotoPagina = (num) => {
        const btn = document.createElement("button");
        btn.className = "btn-paginacio";
        if (num === paginaActual) {
            btn.classList.add("actiu");
        }
        btn.textContent = num;
        btn.onclick = async () => await llistaUsuaris(num);
        return btn;
    };
    
    // Lògica per mostrar pàgines amb ellipsis
    if (totalPagines <= 7) {
        // Si hi ha 7 o menys pàgines, mostrar-les totes
        for (let i = 1; i <= totalPagines; i++) {
            paginacioElement.appendChild(crearBotoPagina(i));
        }
    } else {
        // Si hi ha més de 7 pàgines, utilitzar ellipsis
        if (paginaActual <= 3) {
            // Mostrar: 1 2 3 4 5 ... última
            for (let i = 1; i <= 5; i++) {
                paginacioElement.appendChild(crearBotoPagina(i));
            }
            const ellipsis = document.createElement("span");
            ellipsis.className = "ellipsis";
            ellipsis.textContent = "...";
            paginacioElement.appendChild(ellipsis);
            paginacioElement.appendChild(crearBotoPagina(totalPagines));
        } else if (paginaActual >= totalPagines - 2) {
            // Mostrar: 1 ... últimes 5 pàgines
            paginacioElement.appendChild(crearBotoPagina(1));
            const ellipsis = document.createElement("span");
            ellipsis.className = "ellipsis";
            ellipsis.textContent = "...";
            paginacioElement.appendChild(ellipsis);
            for (let i = totalPagines - 4; i <= totalPagines; i++) {
                paginacioElement.appendChild(crearBotoPagina(i));
            }
        } else {
            // Mostrar: 1 ... pàgina-1 pàgina pàgina+1 ... última
            paginacioElement.appendChild(crearBotoPagina(1));
            const ellipsis1 = document.createElement("span");
            ellipsis1.className = "ellipsis";
            ellipsis1.textContent = "...";
            paginacioElement.appendChild(ellipsis1);
            
            for (let i = paginaActual - 1; i <= paginaActual + 1; i++) {
                paginacioElement.appendChild(crearBotoPagina(i));
            }
            
            const ellipsis2 = document.createElement("span");
            ellipsis2.className = "ellipsis";
            ellipsis2.textContent = "...";
            paginacioElement.appendChild(ellipsis2);
            paginacioElement.appendChild(crearBotoPagina(totalPagines));
        }
    }
    
    // Botó pàgina següent
    const btnSeguent = document.createElement("button");
    btnSeguent.className = "btn-paginacio";
    btnSeguent.innerHTML = "Següent &raquo;";
    btnSeguent.disabled = paginaActual === totalPagines;
    btnSeguent.onclick = async () => {
        if (paginaActual < totalPagines) {
            await llistaUsuaris(paginaActual + 1);
        }
    };
    paginacioElement.appendChild(btnSeguent);
    
    // Informació de pàgina
    const infoPagina = document.createElement("div");
    infoPagina.className = "info-paginacio";
    infoPagina.textContent = `Pàgina ${paginaActual} de ${totalPagines}`;
    paginacioElement.appendChild(infoPagina);
}

// Configurar event listeners
function configurarEventListeners() {
    const formulari = document.getElementById("formulariUsuari");
    const btnCancelar = document.getElementById("btnCancelar");
    const tbody = document.getElementById("llistaUsuaris");
    const btnLogout = document.getElementById("btnLogout");
    btnLogout.addEventListener("click", () => function(e){
        e.preventDefault();
        // Eliminar l'usuari actual del localStorage
        tancarSessio("../login.html");
    });
    
    // Submit del formulari amb HTML5 validation
    formulari.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Utilitzar checkValidity() per validar el formulari
        if (!formulari.checkValidity()) {
            // Mostrar missatges d'error personalitzats
            mostrarErrorsValidacio();
            // Trigger HTML5 validation UI
            formulari.reportValidity();
            return;
        }
        
        const userId = document.getElementById("userIdUsuari").value;

        if (!userId || userId === "-1") {
            afegirUsuari();
        } else {
            actualitzarUsuari(userId);
        }
    });
    
    // Botó cancel·lar
    btnCancelar.addEventListener("click", function() {
        cancelarEdicio();
    });
    
    // Event delegation per als botons de la taula
    tbody.addEventListener("click", function(e) {
        const editar = e.target.closest(".icon-editar");
        const eliminar = e.target.closest(".icon-borrar");
        
        if (editar) {
            e.preventDefault();
            const fila = editar.closest("tr");
            const tdId = fila.querySelector("td:first-child");
            editarUsuari(tdId.textContent);
        } else if (eliminar) {
            e.preventDefault();
            const fila = eliminar.closest("tr");
            const tdId = fila.querySelector("td:first-child");
            eliminarUsuari(tdId.textContent);
        }
    });
}

// Configurar validació en temps real
function configurarValidacioTempsReal() {
    const camps = ['nomUsuari', 'emailUsuari', 'passwordUsuari', 'rolUsuari'];
    
    camps.forEach(campId => {
        const element = document.getElementById(campId);
        if (element) {
            // Validar quan l'usuari surt del camp (blur)
            element.addEventListener('blur', function() {
                validarCamp(this);
            });
            
            // Netejar error quan l'usuari comença a escriure
            element.addEventListener('input', function() {
                if (this.validity.valid) {
                    netejarErrorCamp(this);
                }
            });
            
            // Per al camp select, validar on change
            if (element.tagName === 'SELECT') {
                element.addEventListener('change', function() {
                    validarCamp(this);
                });
            }
        }
    });
}

// Validar un camp individual
function validarCamp(camp) {
    const errorElement = document.getElementById(camp.id + 'Error');
    
    // Utilitzar l'API de validació HTML5
    if (!camp.validity.valid) {
        let missatgeError = '';
        
        // Personalitzar missatges d'error segons el tipus de validació
        if (camp.validity.valueMissing) {
            missatgeError = 'Aquest camp és obligatori';
        } else if (camp.validity.typeMismatch) {
            if (camp.type === 'email') {
                missatgeError = 'Introdueix un correu electrònic vàlid';
            }
        } else if (camp.validity.tooShort) {
            missatgeError = `Mínim ${camp.minLength} caràcters (actual: ${camp.value.length})`;
        } else if (camp.validity.tooLong) {
            missatgeError = `Màxim ${camp.maxLength} caràcters`;
        } else if (camp.validity.patternMismatch) {
            // Missatges personalitzats segons el camp
            switch(camp.id) {
                case 'nomUsuari':
                    missatgeError = 'El nom només pot contenir lletres i espais';
                    break;
                case 'emailUsuari':
                    missatgeError = 'Format de correu electrònic invàlid';
                    break;
                case 'passwordUsuari':
                    missatgeError = 'La contrasenya ha de tenir entre 8 i 20 caràcters';
                    break;
                default:
                    missatgeError = camp.validationMessage;
            }
        } else {
            missatgeError = camp.validationMessage;
        }
        
        // Mostrar error
        if (errorElement) {
            errorElement.textContent = missatgeError;
            errorElement.style.display = 'block';
        }
        camp.classList.add('invalid');
        camp.classList.remove('valid');
        
        return false;
    } else {
        // Camp vàlid
        netejarErrorCamp(camp);
        return true;
    }
}

// Netejar error d'un camp
function netejarErrorCamp(camp) {
    const errorElement = document.getElementById(camp.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    camp.classList.remove('invalid');
    camp.classList.add('valid');
}

// Mostrar errors de validació per tots els camps
function mostrarErrorsValidacio() {
    const camps = document.querySelectorAll('#formulariUsuari input[required], #formulariUsuari select[required]');
    let primerCampInvalid = null;
    
    camps.forEach(camp => {
        if (!camp.validity.valid) {
            validarCamp(camp);
            if (!primerCampInvalid) {
                primerCampInvalid = camp;
            }
        }
    });
    
    // Focus al primer camp invàlid
    if (primerCampInvalid) {
        primerCampInvalid.focus();
    }
}

 // Afegir nou usuari
 async function afegirUsuari() {
    const formulari = document.getElementById("formulariUsuari");
    
    // Doble comprovació amb HTML5 validation API
    if (!formulari.checkValidity()) {
        formulari.reportValidity();
        return;
    }
    
    const nom = document.getElementById("nomUsuari").value.trim();
    const email = document.getElementById("emailUsuari").value.trim();
    const password = document.getElementById("passwordUsuari").value;
    const rol = document.getElementById("rolUsuari").value;
    
    // Validació addicional: comprovar si l'email ja existeix
    const usuaris = await obtenirUsuaris();
    if (usuaris.some(u => u.email === email)) {
        mostrarError("Aquest correu electrònic ja està registrat.");
        document.getElementById("emailUsuari").focus();
        return;
    }
    

    
    // Crear nou usuari
    const nouUsuari = {
        name: nom,
        password: password,
        email: email,
        rol: rol
    };
    
    // Afegir a l'API
    const created = await postData(url, 'UserWC', nouUsuari);
    if (created) {
        // Recarregar la llista completa des de l'API
        const usuarisActualitzats = await obtenirUsuaris();
        const totalPagines = Math.ceil(usuarisActualitzats.length / usuarisPerPagina);
        await llistaUsuaris(totalPagines);
        netejarFormulari();
        mostrarExit("Usuari afegit correctament!");
    } else {
        mostrarError('No s\'ha pogut afegir l\'usuari al servidor.');
        return;
    }
}

// Editar usuari existent
async function editarUsuari(userId) {
    const usuaris = await obtenirUsuaris();
    const usuari = usuaris.find(u => String(u.id) === String(userId));
    
    if (!usuari) return;
    
    // Omplir formulari amb dades de l'usuari
    document.getElementById("userIdUsuari").value = usuari.id;
    document.getElementById("nomUsuari").value = usuari.name || usuari.nom || '';
    document.getElementById("emailUsuari").value = usuari.email || '';
    document.getElementById("passwordUsuari").value = usuari.password || '';
    document.getElementById("rolUsuari").value = usuari.rol || '';
    
    // Netejar estats de validació
    const camps = document.querySelectorAll('#formulariUsuari input, #formulariUsuari select');
    camps.forEach(camp => {
        camp.classList.remove('invalid', 'valid');
        netejarErrorCamp(camp);
    });
    
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
 async function actualitzarUsuari(userId) {
    const formulari = document.getElementById("formulariUsuari");
    
    // Validació HTML5
    if (!formulari.checkValidity()) {
        formulari.reportValidity();
        return;
    }
    
    const nom = document.getElementById("nomUsuari").value.trim();
    const email = document.getElementById("emailUsuari").value.trim();
    const password = document.getElementById("passwordUsuari").value;
    const rol = document.getElementById("rolUsuari").value;
    
    const usuaris = await obtenirUsuaris();
    const usuariActual = usuaris.find(u => String(u.id) === String(userId));
    
    if (!usuariActual) {
        mostrarError('Usuari no encontrat.');
        return;
    }
    
    // Comprovar si l'email ja existeix en un altre usuari
    const emailExistent = usuaris.some((u) => String(u.id) !== String(userId) && u.email === email);
    if (emailExistent) {
        mostrarError("Aquest correu electrònic ja està en ús per un altre usuari.");
        document.getElementById("emailUsuari").focus();
        return;
    }
    
    // Actualitzar usuari mantenint l'ID original
    const usuariActualitzat = {
        ...usuariActual,
        name: nom,
        email: email,
        password: password,
        rol: rol
    };
    
    // Guardar canvis al servidor
    const updated = await updateId(url, 'UserWC', userId, usuariActualitzat);
    if (!updated) {
        mostrarError('No s\'ha pogut actualitzar l\'usuari al servidor.');
        return;
    }
    
    // Actualitzar UI mantenint la pàgina actual
    await llistaUsuaris(paginaActual);
    cancelarEdicio();
    mostrarExit("Usuari actualitzat correctament!");
}

// Eliminar usuari
async function eliminarUsuari(userId) {
    // Confirmació abans d'eliminar
    if (!confirm("Estàs segur que vols eliminar aquest usuari?")) {
        return;
    }
    
    const usuaris = await obtenirUsuaris();
    const usuariEliminat = usuaris.find(u => String(u.id) === String(userId));
    if (!usuariEliminat) return;

    // Suprimir de l'API
    await deleteData(url, 'UserWC', userId);
    
    // Actualitzar UI - refetch per obtenir el recompte real
    const usuarisActuals = await obtenirUsuaris();
    const totalPagines = Math.ceil(usuarisActuals.length / usuarisPerPagina);
    if (paginaActual > totalPagines && totalPagines > 0) {
        paginaActual = totalPagines;
    }
    await llistaUsuaris(paginaActual);
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

// Netejar formulari
function netejarFormulari() {
    const formulari = document.getElementById("formulariUsuari");
    formulari.reset();
    document.getElementById("userIdUsuari").value = "-1";
    
    // Netejar estats de validació i missatges d'error
    const camps = formulari.querySelectorAll('input, select');
    camps.forEach(camp => {
        camp.classList.remove('invalid', 'valid');
        netejarErrorCamp(camp);
    });
    
    netejarMissatges();
}

// Mostrar missatge d'error general
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

// Personalitzar missatges de validació HTML5 (opcional)
document.addEventListener("DOMContentLoaded", function() {
    // Personalitzar missatges per cada camp si és necessari
    const nomUsuari = document.getElementById("nomUsuari");
    if (nomUsuari) {
        nomUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("El nom és obligatori");
            } else if (this.validity.tooShort) {
                this.setCustomValidity("El nom ha de tenir almenys 2 caràcters");
            } else if (this.validity.patternMismatch) {
                this.setCustomValidity("El nom només pot contenir lletres i espais");
            } else {
                this.setCustomValidity("");
            }
        });
        
        nomUsuari.addEventListener("input", function() {
            this.setCustomValidity("");
        });
    }
    
    const emailUsuari = document.getElementById("emailUsuari");
    if (emailUsuari) {
        emailUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("El correu electrònic és obligatori");
            } else if (this.validity.typeMismatch || this.validity.patternMismatch) {
                this.setCustomValidity("Introdueix un correu electrònic vàlid");
            } else {
                this.setCustomValidity("");
            }
        });
        
        emailUsuari.addEventListener("input", function() {
            this.setCustomValidity("");
        });
    }
    
    const passwordUsuari = document.getElementById("passwordUsuari");
    if (passwordUsuari) {
        passwordUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("La contrasenya és obligatòria");
            } else if (this.validity.tooShort) {
                this.setCustomValidity("La contrasenya ha de tenir almenys 8 caràcters");
            } else if (this.validity.tooLong) {
                this.setCustomValidity("La contrasenya no pot tenir més de 20 caràcters");
            } else {
                this.setCustomValidity("");
            }
        });
        
        passwordUsuari.addEventListener("input", function() {
            this.setCustomValidity("");
        });
    }
    
    const rolUsuari = document.getElementById("rolUsuari");
    if (rolUsuari) {
        rolUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("Has de seleccionar un rol");
            } else {
                this.setCustomValidity("");
            }
        });
        
        rolUsuari.addEventListener("change", function() {
            this.setCustomValidity("");
        });
    }
});