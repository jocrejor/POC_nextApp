document.addEventListener("DOMContentLoaded", main);

function main () {
    document.getElementById("tornar").addEventListener("click", tornar);
    document.getElementById("enviar").addEventListener("click", guardardadeslocalsstorage, false);
}

function tornar () {
    window.location.assign("../llistar/llistarimatges.html");
}

//  VALIDACIONS

function validarnom () {
    var element = document.getElementById("nom");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un nom.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom ha de tindre entre 2 i 100 caracters.");
        }
        return false;
    }
    return true;
}

function validarurl () {
    var element = document.getElementById("url");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr una URL.");
        }
        if (element.validity.patternMismatch) {
            error(element, "URL d'imatge no vàlida (.jpg, .jpeg, .png, .gif, .webp).");
        }
        return false;
    }
    return true;
}

function validarordre () {
    var element = document.getElementById("order");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un número.");
        }
        if (element.validity.badInput) {
            error(element, "El valor ha de ser un número enter.");
        }
        return false;
    }
    return true;
}

// --- GUARDAR AL LOCALSTORAGE ---

function guardardadeslocalsstorage (e) {
    if (!validar(e)) {
        e.preventDefault();
        return;
    }

    let comprovararray = JSON.parse(localStorage.getItem("image")) || [];
    let id = 1;
    if (comprovararray.length > 0) {
        let ultim_id = comprovararray[comprovararray.length - 1].id;
        id = ultim_id + 1;
    }

    let dades = {
        id: id,
        name: document.getElementById("nom").value.trim(),
        url: document.getElementById("url").value.trim(),
        order: parseInt(document.getElementById("order").value.trim(), 10)
    };

    comprovararray.push(dades);
    localStorage.setItem("image", JSON.stringify(comprovararray));
    alert("Imatge guardada en localStorage!");

    // Netejar camps
    document.getElementById("nom").value = "";
    document.getElementById("url").value = "";
    document.getElementById("order").value = "";
    window.location.href = "../llistar/llistarimatges.html";

}

// --- VALIDAR TOT ---
function validar (e) {
    esborrarError();
    if (validarnom() && validarurl() && validarordre() && confirm("Confirma si vols enviar el formulari")) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

// --- GESTIÓ D'ERRORS ---
function error (element, missatge) {
    let miss = document.createTextNode(missatge);
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}

function esborrarError () {
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.forms[0];
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}
