document.addEventListener("DOMContentLoaded", main);

function main() {
    // Configuració del botó de hamburguesa
    const menu_hamburguesa = document.getElementById("menu_hamburguesa");
    const nav = document.getElementById("nav");
    let visible = false;

    // Gestió del menú de hamburguesa
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

    // Gestió dels elements del footer
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

    // --- GESTIÓ DEL MODAL DE PAGAMENT ---
    
    // Obtenir elements del DOM - Modal de Pagament
    const modal = document.getElementById('modalPagament');
    const botosTrigger = document.querySelectorAll('.modal-trigger');
    const tancarModal = document.querySelector('.modal-tancar');
    const numeroTarjetaInput = document.getElementById('numeroTarjeta');
    const dataExpiracioInput = document.getElementById('dataExpiracio');
    const cvvInput = document.getElementById('cvv');
    const botoPagar = document.querySelector('.modal-boto-pagar');
    const botoComprar = document.querySelector('.modal-boto-comprar');
    
    // Obtenir elements del DOM - Modal de Contacte
    const modalContacte = document.getElementById('modalContacte');
    const botosContacteTrigger = document.querySelectorAll('.contact-modal-trigger');
    const tancarModalContacte = document.querySelector('.modal-tancar-contacte');
    const botoEnviar = document.querySelector('.modal-boto-enviar');
    
    // Funció per tancar el modal de pagament
    const tancarModalFunc = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Netejar formulari
        document.getElementById('nomTitular').value = '';
        document.getElementById('numeroTarjeta').value = '';
        document.getElementById('dataExpiracio').value = '';
        document.getElementById('cvv').value = '';
        document.getElementById('codiPostal').value = '';
    };
    
    // Funció per tancar el modal de contacte
    const tancarModalContacteFunc = () => {
        modalContacte.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Netejar formulari
        document.getElementById('contactNom').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactTelefon').value = '';
        document.getElementById('contactMissatge').value = '';
    };
    
    // Obrir modal de pagament
    botosTrigger.forEach(boto => {
        boto.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Obrir modal de contacte
    botosContacteTrigger.forEach(boto => {
        boto.addEventListener('click', () => {
            modalContacte.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Tancar modal de pagament amb el botó X
    tancarModal.addEventListener('click', tancarModalFunc);
    
    // Tancar modal de contacte amb el botó X
    tancarModalContacte.addEventListener('click', tancarModalContacteFunc);
    
    // Tancar modals fent clic fora del contingut
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            tancarModalFunc();
        }
        if (event.target === modalContacte) {
            tancarModalContacteFunc();
        }
    });
    
    // Tancar modals amb la tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (modal.style.display === 'block') {
                tancarModalFunc();
            }
            if (modalContacte.style.display === 'block') {
                tancarModalContacteFunc();
            }
        }
    });
    
    // Formatar número de targeta (afegir espais cada 4 dígits)
    numeroTarjetaInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\s/g, '');
        let valorFormatat = '';
        
        for (let i = 0; i < valor.length; i++) {
            if (i > 0 && i % 4 === 0) {
                valorFormatat += ' ';
            }
            valorFormatat += valor[i];
        }
        
        e.target.value = valorFormatat;
    });
    
    // Formatar data d'expiració (MM / AA)
    dataExpiracioInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\s/g, '').replace(/\//g, '');
        
        if (valor.length >= 2) {
            valor = valor.substring(0, 2) + ' / ' + valor.substring(2, 4);
        }
        
        e.target.value = valor;
    });
    
    // Validar que només s'introdueixin números en CVV
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
    
    // Validar que només s'introdueixin números en el número de targeta
    numeroTarjetaInput.addEventListener('keypress', (e) => {
        if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
            e.preventDefault();
        }
    });
    
    // Gestionar el botó de "Pagar"
    botoPagar.addEventListener('click', (e) => {
        e.preventDefault();
        
        const nomTitular = document.getElementById('nomTitular').value;
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        const dataExpiracio = document.getElementById('dataExpiracio').value;
        const cvv = document.getElementById('cvv').value;
        const codiPostal = document.getElementById('codiPostal').value;
        
        if (!nomTitular || !numeroTarjeta || !dataExpiracio || !cvv || !codiPostal) {
            alert('Si us plau, completa tots els camps');
            return;
        }
        
        if (numeroTarjeta.replace(/\s/g, '').length !== 16) {
            alert('El número de targeta ha de tenir 16 dígits');
            return;
        }
        
        if (cvv.length !== 3) {
            alert('El CVV ha de tenir 3 dígits');
            return;
        }
        
        alert('Pagament processat correctament!');
        tancarModalFunc();
    });
    
    // Gestionar el botó de "Comprar"
    botoComprar.addEventListener('click', (e) => {
        e.preventDefault();
        
        const nomTitular = document.getElementById('nomTitular').value;
        const numeroTarjeta = document.getElementById('numeroTarjeta').value;
        const dataExpiracio = document.getElementById('dataExpiracio').value;
        const cvv = document.getElementById('cvv').value;
        const codiPostal = document.getElementById('codiPostal').value;
        
        if (!nomTitular || !numeroTarjeta || !dataExpiracio || !cvv || !codiPostal) {
            alert('Si us plau, completa tots els camps');
            return;
        }
        
        if (numeroTarjeta.replace(/\s/g, '').length !== 16) {
            alert('El número de targeta ha de tenir 16 dígits');
            return;
        }
        
        if (cvv.length !== 3) {
            alert('El CVV ha de tenir 3 dígits');
            return;
        }
        
        alert('Compra processada correctament!');
        tancarModalFunc();
    });
    
    // Gestionar el botó "Enviar" del formulari de contacte
    botoEnviar.addEventListener('click', (e) => {
        e.preventDefault();
        
        const nom = document.getElementById('contactNom').value;
        const email = document.getElementById('contactEmail').value;
        const telefon = document.getElementById('contactTelefon').value;
        const missatge = document.getElementById('contactMissatge').value;
        
        if (!nom || !email || !telefon || !missatge) {
            alert('Si us plau, completa tots els camps');
            return;
        }
        
        // Validació bàsica de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Si us plau, introdueix un email vàlid');
            return;
        }
        
        alert('Missatge enviat correctament! Ens posarem en contacte aviat.');
        tancarModalContacteFunc();
    });
}