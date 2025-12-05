document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("enviar").addEventListener("click", guardardadeslocalsstorage, false);
    arreplegarindex();
}



function guardardadeslocalsstorage(e) {
    if (!validar(e)) {
        e.preventDefault();
        return;
    }

    let comprovararray = JSON.parse(localStorage.getItem("image")) || [];
    let dades = {
        name: document.getElementById("nom").value.trim(),
        url: document.getElementById("url").value.trim(),
        order: document.getElementById("order").value.trim(),
     
    }

   let idEdicion = localStorage.getItem("indiceEdicionimg");

    if (idEdicion !== null) {
        // Busca la imatge por ID
        let index = comprovararray.findIndex(n => n.id == idEdicion);
        if (index !== -1) {
       
            dades.id = comprovararray[index].id;
            comprovararray[index] = dades;
            localStorage.removeItem("indiceEdicionimg");
            alert("Imatge modificada correctament!");
        } else {
            alert("No s'ha trobat la imatge per editar.");
        }
    } else {
        alert("No s'ha proporcionat cap ID d'edició.");
    }

    localStorage.setItem("image", JSON.stringify(comprovararray));

    // Netejar camps
    document.getElementById("nom").value = "";
    document.getElementById("url").value = "";
    document.getElementById("order").value = "";

    window.location.href = "../llistar/llistarimatges.html";
}

// Funció encarregada de arreplegar el id que li pase de llistar 
function arreplegarindex(){

    let idEdicion = localStorage.getItem("indiceEdicionimg");

    if (idEdicion !== null) {
     
        let imatges = JSON.parse(localStorage.getItem("image")) || [];
        let imatge = imatges.find(n => n.id == idEdicion);

        if (imatge) {
            document.getElementById("nom").value = imatge.name;
            document.getElementById("url").value = imatge.url;
            document.getElementById("order").value = imatge.order;
            document.getElementById("enviar").textContent = "Guardar cambios";
        }
    }
}



/*    Valida el nom   */

    function validarnom() {
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

    /*    Valida la url  */
    function validarurl() {
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
/*    Valida el ordre   */
    function validarordre() {
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


    function validar(e) {
        esborrarError();
        if (validarnom() && validarurl() && validarordre() && confirm("Confirma si vols enviar el formulari")) {
            return true;
        } else {
            e.preventDefault();
            return false;
        }
    }


function error(element, missatge) {
    let miss = document.createTextNode(missatge);
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.forms[0];
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}
