document.addEventListener("DOMContentLoaded", main);

function main() {
    const menu_hamburguesa = document.getElementById("menu_hamburguesa");
    const nav = document.getElementById("nav");
    const titols = document.querySelectorAll(".titol_footer");

    let visible = false;

    // Funció per saber si estem en vista mòbil
    const esMobil = () => window.innerWidth <= 767;

    if (nav) {
        if (esMobil()) {
            nav.style.display = "none";
            visible = false;
        } else {
            nav.style.display = "";
            visible = false;
        }
    }

    // --- MENU HAMBURGUESA---
    if (menu_hamburguesa && nav) {
        menu_hamburguesa.addEventListener("click", () => {
            if (!esMobil()) return;

            if (visible) {
                nav.style.display = "none";
                visible = false;
            } else {
                nav.style.display = "block";
                visible = true;
            }
        });
    }

    // --- FOOTER: funció per inicialitzar segons mida ---
    function inicialitzarFooter() {
        const footerElements = document.querySelectorAll(".footer_element");

        footerElements.forEach(footerElement => {
            const links = footerElement.querySelectorAll(".footer_opcio");
            const xarxes = footerElement.querySelector(".xarxes");

            if (esMobil()) {
                footerElement.classList.remove("footer_element_seleccionat");
                links.forEach(link => {
                    link.style.display = "none";
                });
                if (xarxes) {
                    xarxes.style.display = "none";
                }
            } else {
                footerElement.classList.remove("footer_element_seleccionat");
                links.forEach(link => {
                    link.style.display = "";
                });
                if (xarxes) {
                    xarxes.style.display = "";
                }
            }
        });
    }

    inicialitzarFooter();

    // --- CLIC EN ELS TÍTOLS DEL FOOTER ---
    titols.forEach(titol => {
        titol.addEventListener("click", () => {
            if (!esMobil()) return;

            const footerElement = titol.closest(".footer_element");
            const links = footerElement.querySelectorAll(".footer_opcio");
            const xarxes = footerElement.querySelector(".xarxes");

            const obert = footerElement.classList.toggle("footer_element_seleccionat");

            // Si està obert → mostrem; si no → amaguem
            links.forEach(link => {
                link.style.display = obert ? "block" : "none";
            });

            if (xarxes) {
                xarxes.style.display = obert ? "block" : "none";
            }
        });
    });

    // --- CONTROL DEL RESIZE ---
    let eraMobil = esMobil();

    window.addEventListener("resize", () => {
        const araMobil = esMobil();

        if (araMobil !== eraMobil) {
            if (nav) {
                if (araMobil) {
                    nav.style.display = "none";
                    visible = false;
                } else {
                    nav.style.display = "";
                    visible = false;
                }
            }

            inicialitzarFooter();

            eraMobil = araMobil;
        }
    });
}
