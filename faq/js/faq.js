document.addEventListener("DOMContentLoaded", main);

function main() {
    // Configuració del botó de hamburguesa
    const menu_hamburguesa = document.getElementById("menu_hamburguesa");
    const nav = document.getElementById("nav");
    let visible = false;

    menu_hamburguesa.addEventListener("click", () => {
        nav.style.display = visible ? 'none' : 'block';
        visible = !visible;
    });

    // Gestió del footer (mòbil)
    document.querySelectorAll(".titol_footer").forEach(titol => {
        titol.addEventListener("click", () => {
            const footerElement = titol.closest(".footer_element");
            const icon = titol.querySelector("i");
            const opciones = footerElement.querySelectorAll(".footer_opcio, .xarxes");
            
            footerElement.classList.toggle("footer_element_seleccionat");
            
            if (footerElement.classList.contains("footer_element_seleccionat")) {
                icon.classList.replace("fa-chevron-down", "fa-chevron-up");
                opciones.forEach(el => el.style.display = "block");
            } else {
                icon.classList.replace("fa-chevron-up", "fa-chevron-down");
                opciones.forEach(el => el.style.display = "none");
            }
        });
    });

    // Funció per tancar totes les FAQs
    function tancarTotesFAQs(excepcio = null) {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== excepcio) {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
                item.querySelector('.faq-question i').classList.replace('fa-chevron-down', 'fa-plus');
            }
        });
    }

    // Funció per obrir una FAQ
    function obrirFAQ(faqItem) {
        const icon = faqItem.querySelector('.faq-question i');
        const answer = faqItem.querySelector('.faq-answer');
        
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.replace('fa-plus', 'fa-chevron-down');
    }

    // FAQs - Funcionalitat principal
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            
            if (faqItem.classList.contains('active')) {
                // Tancar la FAQ actual
                faqItem.classList.remove('active');
                faqItem.querySelector('.faq-answer').style.maxHeight = null;
                faqItem.querySelector('.faq-question i').classList.replace('fa-chevron-down', 'fa-plus');
            } else {
                // Tancar altres i obrir aquesta
                tancarTotesFAQs();
                obrirFAQ(faqItem);
            }
        });
    });
    
    // Cerca de FAQs
    const faqSearch = document.getElementById('faqSearch');
    if (faqSearch) {
        faqSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const faqItems = document.querySelectorAll('.faq-item');
            
            // Eliminar missatge anterior
            document.querySelector('.no-results')?.remove();
            
            let hiHaResultats = false;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
                const icon = item.querySelector('.faq-question i');
                
                if (searchTerm.length === 0) {
                    item.style.display = 'block';
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    icon.classList.replace('fa-chevron-down', 'fa-plus');
                } else if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    hiHaResultats = true;
                    tancarTotesFAQs(); // Tancar totes abans d'obrir
                    item.classList.add('active');
                    item.querySelector('.faq-answer').style.maxHeight = item.querySelector('.faq-answer').scrollHeight + 'px';
                    icon.classList.replace('fa-plus', 'fa-chevron-down');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                    icon.classList.replace('fa-chevron-down', 'fa-plus');
                }
            });
            
            // Missatge si no hi ha resultats
            if (searchTerm.length > 0 && !hiHaResultats) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results';
                noResultsDiv.innerHTML = `
                    <i class="fa-regular fa-face-frown"></i>
                    <h3>No se encontraron resultados</h3>
                    <p>Intenta con otros términos de búsqueda.</p>
                `;
                document.querySelector('.faq-list').appendChild(noResultsDiv);
            }
        });
    }

    // Botons de preguntes destacades
    document.querySelectorAll('.destacada-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const faqId = btn.getAttribute('data-faq');
            const targetFaq = document.querySelector(`.faq-item[data-faq-id="${faqId}"]`);
            
            if (targetFaq) {
                targetFaq.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    tancarTotesFAQs(); // Tancar totes
                    obrirFAQ(targetFaq); // Obrir la destada
                }, 300);
            }
        });
    });
}