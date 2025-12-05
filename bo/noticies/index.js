document.addEventListener("DOMContentLoaded", main);

let noticies = [];

async function main() {
    noticies = await getData(url, "New");
    carregarDades(noticies);
    document.getElementById("enviar").addEventListener("click", crearNoticia);
}

function carregarDades(noticies) {
    let contenidor = document.getElementById("llistatnoticies");

    while (contenidor.firstChild) {
        contenidor.removeChild(contenidor.firstChild);
    }

    // Si no hi han notícies
    if (!noticies || noticies.length === 0) {
        let fila  = document.createElement("tr");
        let celda = document.createElement("td");

        celda.colSpan = 11;
        celda.appendChild(document.createTextNode("No hi ha notícies guardades."));
        fila.appendChild(celda);
        contenidor.appendChild(fila);
        return;
    }

    noticies.forEach(noticia => {
        let fila       = document.createElement("tr");

        // Checkbox individual
        let check      = document.createElement("td");
        let inputcheck = document.createElement("input");

        // Data formatada
        let data = new Date(noticia.date);
        let dataFormatada = data.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        
        inputcheck.type  = "checkbox";
        inputcheck.name  = "noticies";
        inputcheck.value = noticia.id;
        check.appendChild(inputcheck);
        fila.appendChild(check);

        let camps = [
            noticia.id,
            noticia.title,
            noticia.description,
            dataFormatada,
            noticia.id_category,
            noticia.id_user,
            noticia.id_image,
            noticia.published
        ];

        camps.forEach(valor => {
            let celda = document.createElement("td");

            celda.appendChild(document.createTextNode(valor));
            fila.appendChild(celda);
        });

        // Accions
        let accions = document.createElement("td");

        // Botó "Modificar"
        let btnModificar  = document.createElement("button");
        let iconModificar = document.createElement("i");

        iconModificar.classList.add("fa-solid", "fa-file-pen");

        btnModificar.title = "Modificar";
        btnModificar.appendChild(iconModificar);
        btnModificar.addEventListener("click", function () {
            editarNoticia(noticia.id);
        });

        // Botó "Eliminar"
        let btnEliminar  = document.createElement("button");
        let iconEliminar = document.createElement("i");

        iconEliminar.classList.add("fa-solid", "fa-trash");

        btnEliminar.title = "Eliminar";
        btnEliminar.appendChild(iconEliminar);
        btnEliminar.addEventListener("click", function () {
            eliminarNoticia(noticia.id);
        });

        // Botó "Visualitzar"
        let btnVisualitzar  = document.createElement("button");
        let iconVisualitzar = document.createElement("i");

        iconVisualitzar.classList.add("fa-solid", "fa-eye");

        btnVisualitzar.title = "Visualitzar";
        btnVisualitzar.appendChild(iconVisualitzar);
        btnVisualitzar.addEventListener("click", function () {
            visualitzarNoticia(noticia.id);
        });

        // Afegir botons
        accions.appendChild(btnModificar);
        accions.appendChild(btnEliminar);
        accions.appendChild(btnVisualitzar);

        // Afegir la notícia
        fila.appendChild(accions);
        contenidor.appendChild(fila);
    });
}

function crearNoticia() {
    window.location.href = "./crearNoticia.html";
}

async function eliminarNoticia(id) {
    if (confirm("Segur que vols eliminar aquesta notícia?")) {
        await deleteData(url, "New", id);
        noticies = await getData(url, "New");
        carregarDades(noticies);
    }
}

function editarNoticia(id) {
    window.location.href = "./modificarNoticia.html?id=" + id;
}

function visualitzarNoticia(id) {
    window.location.href = "./visualitzarNoticia.html?id=" + id;
}
