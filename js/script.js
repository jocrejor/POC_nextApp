document.addEventListener("DOMContentLoaded", main);

function main() {
    // Configuració del botó de hamburguesa
    const menu_hamburguesa = document.getElementById("menu_hamburguesa");
    const nav = document.getElementById("nav");
    let visible = false;

    // Gestió del mení de hamburguesa
    menu_hamburguesa.addEventListener("click", (e) => {
        if (visible) {
            nav.style.display = 'none';
            visible = false;
        } else {
            nav.style.display = 'block';
            visible = true;
        }
    });

    const titols = document.querySelectorAll(".titol_footer");

    // Gestió del elements del footer
    titols.forEach(titol => {
        titol.addEventListener("click", () => {
        const footerElement = titol.closest(".footer_element");
        const icon = titol.querySelector("i");
        
        // Tots els elements que tenen que mostrar-se/ocultar-se (footer_opcio i xarxes)
        const opciones = footerElement.querySelectorAll(".footer_opcio, .xarxes");

        // Alternar clase principal
        footerElement.classList.toggle("footer_element_seleccionat");

        // Canviar icona i mostrar/ocultar elements
        if (footerElement.classList.contains("footer_element_seleccionat")) {
            icon.classList.replace("fa-chevron-down", "fa-chevron-up");
            opciones.forEach(el => el.style.display = "block");
        } else {
            icon.classList.replace("fa-chevron-up", "fa-chevron-down");
            opciones.forEach(el => el.style.display = "none");
        }
        });
    });
    
}
// Gestió de la secció del main del Logos Marques
document.addEventListener('DOMContentLoaded', function() {
    const gridLogos = document.querySelector('.grid-logos');
    const flechaIzq = document.querySelector('.fletxa-slider.esquerra');
    const flechaDer = document.querySelector('.fletxa-slider.dreta');
    
    let slideActual = 0; 
    
    function moverSlider() {
        const desplazamiento = slideActual * -50; 
        gridLogos.style.transform = `translateX(${desplazamiento}%)`;
    }

    flechaDer.addEventListener('click', () => {
        if (slideActual < 1) {
            slideActual++;
            moverSlider();
        }
    });

    flechaIzq.addEventListener('click', () => {
        if (slideActual > 0) {
            slideActual--;
            moverSlider();
        }
    });
});