document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("tornar").addEventListener("click", tornar);
    document.getElementById("enviar").addEventListener("click", guardarDades, false);
}

// Torna al llistat
function tornar() {
    window.location.assign("./index.html");
}

// Validacions individuals
function validarTitol() {
    let titol = document.getElementById("titol");

    if (!titol.checkValidity()) {
        if (titol.validity.valueMissing)
            error(titol, "Deus d'introduïr un títol.");
        if (titol.validity.patternMismatch)
            error(titol, "El títol ha de tindre entre 2 i 50 caracters.");

        return false;
    }
    return true;
}

function validarSubtitol() {
    let subtitol = document.getElementById("subtitol");

    if (!subtitol.checkValidity()) {
        if (subtitol.validity.valueMissing)
            error(subtitol, "Deus d'introduïr un subtítol.");
        if (subtitol.validity.patternMismatch)
            error(subtitol, "El subtítol ha de tindre entre 5 i 100 caracters.");

        return false;
    }
    return true;
}

function validarContingut() {
    let contingut = document.getElementById("contingut");

    if (!contingut.checkValidity()) {
        if (contingut.validity.valueMissing)
            error(contingut, "Deus d'introduïr un contingut.");

        return false;
    }
    return true;
}

function validarData() {
    let data = document.getElementById("data");

    if (!data.checkValidity()) {
        if (data.validity.valueMissing)
            error(data, "Has d'introduïr una data.");

        return false;
    }
    return true;
}

// Validació global
function validar(e) {
    esborrarError();

    if (validarTitol() &&
    validarSubtitol() &&
    validarContingut() &&
    validarData() &&
    confirm("Confirma si vols enviar el formulari"))
    {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

async function guardarDades(e) {
    if (!validar(e)) {
        e.preventDefault();
        return;
    }

    let dades = {
        title: document.getElementById("titol").value.trim(),
        description: document.getElementById("subtitol").value.trim(),
        body: document.getElementById("contingut").value.trim(),
        date: document.getElementById("data").value,
        id_category: Math.floor(Math.random() * 100) + 1,
        id_user: 1,
        id_image: 1
    };

    try {
        await postData(url, "New", dades);
        alert("Notícia creada correctament");
        window.location.href = "./index.html";
    }

    catch (err) {
        alert("Error al crear una nova notícia" + err.message);
    }

    // Netejar camps del formulari
    document.getElementById("titol").value = "";
    document.getElementById("subtitol").value = "";
    document.getElementById("contingut").value = "";
    document.getElementById("data").value = "";
}

function error(element, missatge) {
    let contenedorError = document.getElementById("missatgeError");
    let p = document.createElement("p");
    let textNode = document.createTextNode(missatge);

    p.appendChild(textNode);
    contenedorError.appendChild(p);

    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    let contenedorError = document.getElementById("missatgeError");

    // Eliminar tots els fills del contenidor
    while (contenedorError.firstChild) {
        contenedorError.removeChild(contenedorError.firstChild);
    }

    // Llevar la classe "error" de tots els elements del formulari
    let formulari = document.forms[0];
    
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}
