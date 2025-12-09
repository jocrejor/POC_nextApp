document.addEventListener("DOMContentLoaded", main);

function main() {
    // --- VARIABLES PRINCIPALS ---
    const menu_hamburguesa = document.getElementById("menu_hamburguesa");
    const nav = document.getElementById("nav");
    let menuVisible = false;

    const titols = document.querySelectorAll(".titol_footer");

    // Variables del Slider de Logos
    const gridLogos = document.querySelector('.grid-logos');
    const flechaIzq = document.querySelector('.fletxa-slider.esquerra');
    const flechaDer = document.querySelector('.fletxa-slider.dreta');
    let slideActual = 0; 
    
    // FUNCIÓ AUXILIAR DEL SLIDER
    function moverSlider() {
        if (gridLogos) {
            const desplazamiento = slideActual * -50; 
            gridLogos.style.transform = `translateX(${desplazamiento}%)`;
        }
    }

    // GESTIÓ DEL MENÚ DE HAMBURGUESA
    if (menu_hamburguesa && nav) {
        menu_hamburguesa.addEventListener("click", () => {
            if (menuVisible) {
                nav.style.display = 'none';
                menuVisible = false;
            } else {
                nav.style.display = 'block';
                menuVisible = true;
            }
        });
    }

    // GESTIÓ DEL FOOTER
    titols.forEach(titol => {
        titol.addEventListener("click", () => {
            const footerElement = titol.closest(".footer_element");
            const icon = titol.querySelector("i");
            // Tots els elements que han de mostrar-se/ocultar-se
            const opciones = footerElement.querySelectorAll(".footer_opcio, .xarxes"); 

            footerElement.classList.toggle("footer_element_seleccionat");

            // Canviar icona i mostrar/ocultar
            if (footerElement.classList.contains("footer_element_seleccionat")) {
                if(icon) icon.classList.replace("fa-chevron-down", "fa-chevron-up");
                opciones.forEach(el => el.style.display = "block");
            } else {
                if(icon) icon.classList.replace("fa-chevron-up", "fa-chevron-down");
                opciones.forEach(el => el.style.display = "none");
            }
        });
    });

    // GESTIÓ DEL SLIDER DE LOGOS
    if (flechaDer) {
        flechaDer.addEventListener('click', () => {
            if (slideActual < 1) {
                slideActual++;
                moverSlider();
            }
        });
    }

    if (flechaIzq) {
        flechaIzq.addEventListener('click', () => {
            if (slideActual > 0) {
                slideActual--;
                moverSlider();
            }
        });
    }

    // RESET AUTOMÀTIC EN CANVIAR LA MIDA 
    window.addEventListener('resize', () => {
        // Utilitzem 768px com a punt de trencament (breakpoint). Ajusta si el teu CSS és diferent.
        if (window.innerWidth > 768) { 
            
            // RESET DEL NAV
            if (nav) {
                nav.style.display = "";
                menuVisible = false;
            }
            
            // RESET DEL FOOTER
            const footerElements = document.querySelectorAll(".footer_element");
            footerElements.forEach(elem => {
                elem.classList.remove("footer_element_seleccionat"); 
                const icon = elem.querySelector(".titol_footer i");
                if (icon) icon.classList.replace("fa-chevron-up", "fa-chevron-down"); 
                
                const opciones = elem.querySelectorAll(".footer_opcio, .xarxes");
                opciones.forEach(op => {
                    op.style.display = "";
                });
            });

            // RESET DEL SLIDER DE LOGOS
            if (gridLogos) {
                slideActual = 0;
                gridLogos.style.transform = "translateX(0%)";
            }
        }
    });
}