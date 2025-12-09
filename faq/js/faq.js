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

    // ---------- MODAL API ----------
    const modalAPI = document.getElementById("modalAPI");
    const btnAPI = document.getElementById("btnAPI");

    if (modalAPI && btnAPI) {
        const closeBtnAPI = modalAPI.querySelector(".modal-close");

        btnAPI.addEventListener("click", async () => {
            modalAPI.style.display = "block";

            const apiContainer = document.getElementById("apiDataContainer");
            apiContainer.innerHTML = "<p>Cargando datos reales de la API...</p>";

            try {
                const families = await getData(url, "Family");
                const products = await getData(url, "Product");
                const attributes = await getData(url, "Attribute");

                apiContainer.innerHTML = `
                    <h4>Families</h4>
                    <pre>${JSON.stringify(families.slice(0, 2), null, 2)}</pre>
                    <h4>Products</h4>
                    <pre>${JSON.stringify(products.slice(0, 2), null, 2)}</pre>
                    <h4>Attributes</h4>
                    <pre>${JSON.stringify(attributes.slice(0, 2), null, 2)}</pre>
                `;
            } catch (err) {
                apiContainer.innerHTML = "<p>Error cargando datos de la API.</p>";
            }
        });

        closeBtnAPI.addEventListener("click", () => {
            modalAPI.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === modalAPI) {
                modalAPI.style.display = "none";
            }
        });
    }

   // ---------- MODAL SCRAPING ----------
const modalScraping = document.getElementById("modalScraping");
const btnScraping = document.getElementById("btnScraping");

if (modalScraping && btnScraping) {
    const closeBtn = modalScraping.querySelector(".modal-close");

    btnScraping.addEventListener("click", async () => {
        modalScraping.style.display = "block";
        
        let scrapingDataContainer = modalScraping.querySelector("#scrapingDataContainer");
        if (!scrapingDataContainer) {
            scrapingDataContainer = document.createElement("div");
            scrapingDataContainer.id = "scrapingDataContainer";
            const lastElement = modalScraping.querySelector("ul:last-of-type");
            lastElement.insertAdjacentElement("afterend", scrapingDataContainer);
        }
        
        scrapingDataContainer.innerHTML = "<p>Cargando datos de ejemplo...</p>";

        try {
            const families = await getData(url, "Family");
            const products = await getData(url, "Product");
            
            scrapingDataContainer.innerHTML = `
                <h4>Datos actuales del sistema</h4>
                <p><strong>Familias:</strong> ${families.length}</p>
                <p><strong>Productos:</strong> ${products.length}</p>
                
                ${families.length > 0 ? `
                    <p><strong>Ejemplo de familia:</strong> ${families[0].name || 'Sin nombre'}</p>
                ` : ''}
                
                ${products.length > 0 ? `
                    <p><strong>Ejemplo de producto:</strong> ${products[0].name || 'Sin nombre'}</p>
                ` : ''}
                
                <p><em>Estos datos son ejemplos de lo que se puede obtener mediante scraping.</em></p>
            `;
            
        } catch (err) {
            scrapingDataContainer.innerHTML = `
                <p>⚠ Error cargando datos en tiempo real</p>
            `;
        }
    });

    closeBtn.addEventListener("click", () => {
        modalScraping.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modalScraping) {
            modalScraping.style.display = "none";
        }
    });
}

// ---------- MODAL CSV ----------
const modalCSV = document.getElementById("modalCSV");
const btnCSV = document.getElementById("btnCSV");

if (modalCSV && btnCSV) {
    const closeBtnCSV = modalCSV.querySelector(".modal-close");

    btnCSV.addEventListener("click", async () => {
        modalCSV.style.display = "block";

        const csvContainer = document.getElementById("csvDataContainer");
        csvContainer.innerHTML = "<p>Cargando estructura de datos actual...</p>";

        try {
            // Obtener datos reales para mostrar la estructura actual
            const families = await getData(url, "Family");
            const products = await getData(url, "Product");
            
            if (families.length > 0 && products.length > 0) {
                // Mostrar estructura basada en datos reales
                const sampleFamily = families[0];
                const sampleProduct = products[0];
                
                csvContainer.innerHTML = `
                    <h5>Estructura actual (basada en datos reales):</h5>
                    
                    <p><strong>Campos de familias:</strong></p>
                    <ul>
                        ${Object.keys(sampleFamily).map(key => `
                            <li><code>${key}</code>: ${typeof sampleFamily[key]}</li>
                        `).join('')}
                    </ul>
                    
                    <p><strong>Campos de productos:</strong></p>
                    <ul>
                        ${Object.keys(sampleProduct).map(key => `
                            <li><code>${key}</code>: ${typeof sampleProduct[key]}</li>
                        `).join('')}
                    </ul>
                    
                    <p><strong>Datos actuales del sistema:</strong></p>
                    <p>Familias: ${families.length} | Productos: ${products.length}</p>
                `;
            } else {
                csvContainer.innerHTML = `
                    <p>Usa la estructura de ejemplo mostrada arriba.</p>
                    <p>Consulta el manual para más detalles.</p>
                `;
            }
        } catch (err) {
            csvContainer.innerHTML = `
                <p>Error cargando estructura de datos.</p>
                <p>Usa los ejemplos proporcionados como referencia.</p>
            `;
        }
    });

    closeBtnCSV.addEventListener("click", () => {
        modalCSV.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modalCSV) {
            modalCSV.style.display = "none";
        }
    });
}

}