document.addEventListener("DOMContentLoaded", main);

async function main() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    if (!id) {
        alert("No s'ha proporcionat cap ID.");
        return;
    }

    let noticia = await getData(url, "New", id);

    if (!noticia) {
        alert("No s'ha trobat la notícia.");
        return;
    }

    carregarNoticia(noticia);
}

function carregarNoticia(noticia) {
    let box = document.getElementById("noticiaBox");

    while (box.firstChild) {
        box.removeChild(box.firstChild);
    }

    let data = new Date(noticia.date);
    let dataFormateada = data.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    // FUNCIÓN PARA CREAR FILAS DEL DETALLE
    function crearFila(titol, valor) {
        let p = document.createElement("p");

        let strong = document.createElement("strong");
        strong.appendChild(document.createTextNode(titol + ": "));

        p.appendChild(strong);
        p.appendChild(document.createTextNode(valor));

        return p;
    }

    // TÍTOL
    let h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode(noticia.title));
    box.appendChild(h2);

    // SUBTÍTOL
    let h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(noticia.description));
    box.appendChild(h3);

    // COS DE LA NOTICIA
    let pBody = document.createElement("p");
    pBody.appendChild(document.createTextNode(noticia.body));
    box.appendChild(pBody);

    // INFO EXTRA
    box.appendChild(crearFila("Data", dataFormateada));
    box.appendChild(crearFila("Categoria", noticia.id_category));
    box.appendChild(crearFila("Usuari", noticia.id_user));
    box.appendChild(crearFila("Imatge", noticia.id_image));
    box.appendChild(crearFila("Publicat", noticia.published ? "Sí" : "No"));
}