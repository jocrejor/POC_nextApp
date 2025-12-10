document.addEventListener("DOMContentLoaded", main);
function main() {
    thereIsUser("login.html");
     let sessioiniciada = localStorage.getItem("currentUser");

    // Netejar la sessió si conté un objecte JSON mal format
    if (sessioiniciada && (sessioiniciada.startsWith('{') || sessioiniciada.startsWith('['))) {
        try {
            sessdata = JSON.parse(sessioiniciada);
            // Posar nom usuari al span
            const spanUsuari = document.getElementById("nomUsuariActiu");
            if (sessdata.name && spanUsuari) {
                spanUsuari.textContent = sessdata.name;
            }
        } catch (e) {
            console.error("Error parsejant dades de sessió", e);
        }
    }
    // Tancar sessió
    const btnLogout = document.getElementById("btnLogout");
    btnLogout.addEventListener("click", function (e) {
        e.preventDefault();
        tancarSessio("login.html");
    });

}