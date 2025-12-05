document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("tornar").addEventListener("click", tornar);
    document.getElementById("enviar").addEventListener("click", guardarDades, false);
    arreplegarIndex();
}

function tornar() {
    window.location.assign("./index.html");
}

async function guardarDades(e) {
    if (!validar(e)) {
        e.preventDefault();
        return;
    }

    const id = document.getElementById("id").value;

    let dades = {
        title: document.getElementById("titol").value.trim(),
        description: document.getElementById("subtitol").value.trim(),
        body: document.getElementById("contingut").value.trim(),
        date: document.getElementById("data").value,
    };

    try {
        await updateId(url, "New", id, dades);
        alert("Notícia modificada correctament");
        window.location.href = "./index.html";
    } catch (err) {
        alert("Error al modificar la notícia" + err.message);
    }
}

async function arreplegarIndex() {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get("id");

    if (!id)
        return;

    let noticia = await getIdData(url, "New", id);

    document.getElementById("id").value        = noticia.id;
    document.getElementById("titol").value     = noticia.title;
    document.getElementById("subtitol").value  = noticia.description;
    document.getElementById("contingut").value = noticia.body;
    document.getElementById("data").value      = noticia.date;
}

function validarTitol() {
    let element = document.getElementById("titol");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing)
            error(element, "Deus d'introduïr un títol.");
        if (element.validity.patternMismatch)
            error(element, "El títol ha de tindre entre 2 i 15 caracters.");
        return false;
    }
    return true;
}

function validarSubtitol() {
    let element = document.getElementById("subtitol");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing)
            error(element, "Deus d'introduïr un subtítol.");
        if (element.validity.patternMismatch)
            error(element, "El subtítol ha de tindre entre 2 i 15 caracters.");
        return false;
    }
    return true;
}

function validarContingut() {
    let element = document.getElementById("contingut");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing)
            error(element, "Deus d'introduïr un contingut.");
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

function validar(e) {
    esborrarError();

    if (validarTitol() &&
        validarSubtitol() &&
        validarContingut() &&
        validarData() &&
        confirm("Confirma si vols enviar el formulari")
    ) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function error(element, missatge) {
    let contenedorError = document.getElementById("missatgeError");
    let p               = document.createElement("p");
    let textNode        = document.createTextNode(missatge);

    p.appendChild(textNode);
    contenedorError.appendChild(p);

    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    let contenedorError = document.getElementById("missatgeError");

    while (contenedorError.firstChild) {
        contenedorError.removeChild(contenedorError.firstChild);
    }

    let formulari = document.forms[0];

    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}
