$(document).ready(function () {
  main();
});

async function main() {
  // ===== Referencias DOM =====
  const contactesList = document.getElementById("contactesList");
  const detailSection = document.getElementById("contactDetailSection");
  const editSection = document.getElementById("editSection");
  const confirmModal = document.getElementById("confirmModal");

  const closeDetailBtn = document.getElementById("closeDetailBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const editForm = document.getElementById("editForm");

  // ===== Referencias jQuery =====
  const $searchInput = $("#searchInput");
  const $clearSearchBtn = $("#clearSearch");
  const $sortSelect = $("#sortSelect");

  // ===== Estado global =====
  let contacteActual = null;
  let contactesTotals = [];
  let contactes = [];

  let currentPage = 1;
  const pageSize = 10;

  // ===== Inicialización =====
  function inicialitzar() {
    carregarContactes();
    configurarEventListeners();
  }

  function amagarTaula() {
    contactesList.classList.add("hidden");
    $searchInput.hide();
    $sortSelect.hide();
    $clearSearchBtn.hide();
  }

  function mostrarTaulaSiToca() {
    if (!detailSection.classList.contains("active") && !editSection.classList.contains("active")) {
      contactesList.classList.remove("hidden");
      $searchInput.show();
      $sortSelect.show();
      $clearSearchBtn.show();
    }
  }

  function configurarEventListeners() {
    // Búsqueda y orden
    $searchInput.on("input", cercarContactes);
    $clearSearchBtn.on("click", netejarCerca);
    $sortSelect.on("change", aplicarFiltres);

    // Detalle
    closeDetailBtn.addEventListener("click", tancarDetall);
    editBtn.addEventListener("click", obrirEdicio);
    deleteBtn.addEventListener("click", obrirModalConfirmacio);

    // Edición
    cancelEditBtn.addEventListener("click", tancarEdicio);
    editForm.addEventListener("submit", guardarEdicio);

    // Modal confirmación
    confirmDeleteBtn.addEventListener("click", eliminarContacte);
    cancelDeleteBtn.addEventListener("click", () => tancarModal(confirmModal));

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === confirmModal) tancarModal(confirmModal);
    });
  }

  // ===== Data (API) =====
  async function obtenerTotsElsContactes() {
    try {
      const contactesAPI = await getData(url, "Contact");
      contactesTotals = contactesAPI;
      return contactesAPI;
    } catch (error) {
      console.error("Error obtenint contactes des de l'API:", error);
      contactesTotals = [];
      return [];
    }
  }

  // ===== Renderizado + paginación =====
  async function carregarContactes(contactesFiltrats = null, pagina = 1) {
    const llistaCompleta = contactesFiltrats || await obtenerTotsElsContactes();
    contactes = llistaCompleta;

    const totalPages = Math.max(1, Math.ceil(llistaCompleta.length / pageSize));

    if (pagina < 1) pagina = 1;
    if (pagina > totalPages) pagina = totalPages;
    currentPage = pagina;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const contactesPagina = llistaCompleta.slice(startIndex, endIndex);

    while (contactesList.firstChild) {
      contactesList.removeChild(contactesList.firstChild);
    }

    if (!contactesPagina || contactesPagina.length === 0) {
      const noElementsDiv = document.createElement("div");
      noElementsDiv.classList.add("noElements");
      const noRes = document.createElement("p");
      noRes.textContent = "No hi ha contactes registrats";
      noElementsDiv.appendChild(noRes);
      contactesList.appendChild(noElementsDiv);
      return;
    }

    const contingutDiv = document.createElement("div");
    contingutDiv.classList.add("contingut");

    const contingutTaulaDiv = document.createElement("div");
    contingutTaulaDiv.id = "contingutTaula";

    const table = document.createElement("table");
    table.id = "taula";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["ID", "Nom", "Email", "Telèfon", "Assumpte", "Data", "Accions"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    const mobileHeaderRow = document.createElement("tr");
    mobileHeaderRow.classList.add("capcalera_movil");
    const mobileHeaderTh = document.createElement("th");
    mobileHeaderTh.textContent = "Llistat";
    mobileHeaderRow.appendChild(mobileHeaderTh);
    tbody.appendChild(mobileHeaderRow);

    contactesPagina.forEach((contacte) => {
      const fila = crearContacteFila(contacte);
      tbody.appendChild(fila);
    });

    table.appendChild(tbody);
    contingutTaulaDiv.appendChild(table);
    contingutDiv.appendChild(contingutTaulaDiv);
    contactesList.appendChild(contingutDiv);

    crearPaginacio(totalPages);
  }

function crearPaginacio(totalPages) {
    const paginationDiv = document.createElement("div");
    paginationDiv.classList.add("pagination");

    // Ocultar la paginación si hay solo una página
    if (totalPages <= 1) {
        paginationDiv.style.display = "none";
        return;
    } else {
        paginationDiv.style.display = "flex";
    }

    // Botón "Anterior"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1; // Deshabilitar si estamos en la página 1
    if (currentPage === 1) prevBtn.style.display = "none"; // Ocultar si estamos en la página 1
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            carregarContactes(contactes, currentPage);
        }
    });
    paginationDiv.appendChild(prevBtn);

    // Determinar las páginas a mostrar: máximo 3 botones
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    // Si estamos cerca del final, ajustamos para mostrar las últimas páginas
    if (endPage - startPage < 2) {
        if (currentPage <= 2) {
            endPage = Math.min(3, totalPages);
        } else if (currentPage >= totalPages - 1) {
            startPage = Math.max(totalPages - 2, 1);
        }
    }

    // Crear botones de las páginas
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-btn");
        if (i === currentPage) {
            pageBtn.classList.add("active"); // Página actual con estilo activo
        }

        pageBtn.addEventListener("click", () => {
            currentPage = i;
            carregarContactes(contactes, currentPage);
        });

        paginationDiv.appendChild(pageBtn);
    }

    // Botón "Siguiente"
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente";
    nextBtn.disabled = currentPage === totalPages; // Deshabilitar si estamos en la última página
    if (currentPage === totalPages) nextBtn.style.display = "none"; // Ocultar si estamos en la última página
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            carregarContactes(contactes, currentPage);
        }
    });
    paginationDiv.appendChild(nextBtn);

    contactesList.appendChild(paginationDiv);
}





  function crearMailto(contacte) {
    const email = contacte.email || "";
    const subject = `Resposta al teu missatge: ${contacte.subject || ""}`;

    const bodyLines = [
      `Hola ${contacte.name || ""},`,
      "",
      "Hem rebut el teu missatge i li estem donant resposta.",
      "",
      "Salutacions,",
      "Equip d'atenció al client"
    ];

    const body = bodyLines.join("\n");

    // Construïm la URL mailto amb codificació
    const mailtoUrl =
      "mailto:" + email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    return mailtoUrl;
  }


  function crearContacteFila(contacte) {
    const row = document.createElement("tr");
    row.dataset.id = contacte.id;

    const dataFormatejada = new Date(contacte.date).toLocaleString("ca-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

    const cells = [
      { value: contacte.id, dataCell: "ID" },
      { value: contacte.name, dataCell: "Nom" },
      { value: contacte.email, dataCell: "Email" },
      { value: contacte.phone || "No especificat", dataCell: "Telèfon" },
      { value: contacte.subject, dataCell: "Assumpte" },
      { value: dataFormatejada, dataCell: "Data" }
    ];

    cells.forEach(cellInfo => {
      const td = document.createElement("td");
      td.textContent = cellInfo.value;
      td.setAttribute("data-cell", cellInfo.dataCell + " : ");
      row.appendChild(td);
    });

    const tdAccions = document.createElement("td");
    tdAccions.setAttribute("data-cell", "Accions");
    tdAccions.setAttribute("data-no-colon", "true");


    const iconVisualitzar = document.createElement("a");
    iconVisualitzar.classList.add("icon-visualitzar");
    iconVisualitzar.href = "#";
    iconVisualitzar.innerHTML = '<i class="fa-solid fa-eye"></i>';
    iconVisualitzar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      contacteActual = contacte;
      obrirDetall();
    });

    const iconEditar = document.createElement("a");
    iconEditar.classList.add("icon-editar");
    iconEditar.href = "#";
    iconEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    iconEditar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      contacteActual = contacte;
      obrirEdicio();
    });

    const iconMail = document.createElement("a");
    iconMail.classList.add("icon-mail");
    iconMail.href = crearMailto(contacte);
    iconMail.innerHTML = '<i class="fa-solid fa-envelope"></i>';
    iconMail.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const iconBorrar = document.createElement("a");
    iconBorrar.classList.add("icon-borrar");
    iconBorrar.href = "#";
    iconBorrar.innerHTML = '<i class="fa-solid fa-trash"></i>';
    iconBorrar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      contacteActual = contacte;
      obrirModalConfirmacio();
    });

    tdAccions.appendChild(iconVisualitzar);
    tdAccions.appendChild(iconEditar);
    tdAccions.appendChild(iconMail);
    tdAccions.appendChild(iconBorrar);
    row.appendChild(tdAccions);

    row.addEventListener("click", (e) => {
      if (confirmModal && confirmModal.classList.contains("active")) {
        return;
      }

      if (!e.target.closest('.icon-visualitzar') &&
        !e.target.closest('.icon-mail') &&
        !e.target.closest('.icon-editar') &&
        !e.target.closest('.icon-borrar')) {
        contacteActual = contacte;
        obrirDetall();
      }
    });

    return row;
  }


  // ===== Filtros y orden =====
  function aplicarFiltres() {
    if (!contactesTotals.length) return;

    const query = $searchInput.val().toLowerCase().trim();
    const order = $sortSelect.val();

    let llista = contactesTotals.filter((contacte) => {
      if (!query) return true;
      return (
        contacte.name.toLowerCase().includes(query) ||
        contacte.email.toLowerCase().includes(query) ||
        contacte.subject.toLowerCase().includes(query) ||
        (contacte.phone && contacte.phone.includes(query))
      );
    });

    llista.sort((a, b) => {
      if (order === "date_desc") {
        return new Date(b.date) - new Date(a.date);
      }
      if (order === "date_asc") {
        return new Date(a.date) - new Date(b.date);
      }
      if (order === "name_asc") {
        return a.name.localeCompare(b.name, "ca", { sensitivity: "base" });
      }
      if (order === "name_desc") {
        return b.name.localeCompare(a.name, "ca", { sensitivity: "base" });
      }
      return 0;
    });

    carregarContactes(llista, 1);
  }

  function cercarContactes() {
    const query = $searchInput.val().toLowerCase().trim();
    if (!query) {
      carregarContactes(null, 1);
      return;
    }

    const contactesFiltrats = contactes.filter((contacte) =>
      contacte.name.toLowerCase().includes(query) ||
      contacte.email.toLowerCase().includes(query) ||
      contacte.subject.toLowerCase().includes(query) ||
      (contacte.phone && contacte.phone.includes(query))
    );

    carregarContactes(contactesFiltrats, 1);
  }

  function netejarCerca() {
    $searchInput.val("");
    $sortSelect.val("");
    carregarContactes(null, 1);
  }

  // ===== Detalle y edición =====
  function obrirDetall() {
    if (!contacteActual) return;

    const container = document.getElementById("contactDetail");

    editSection.classList.remove("active");
    detailSection.classList.add("active");
    amagarTaula();

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const dataFormatejada = new Date(contacteActual.date).toLocaleString("ca-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    function crearDetall(label, valor) {
      const field = document.createElement("div");
      field.className = "detail-field";

      const lab = document.createElement("span");
      lab.className = "detail-label";
      lab.textContent = label;

      const val = document.createElement("div");
      val.className = "detail-value";
      val.textContent = valor;

      field.appendChild(lab);
      field.appendChild(val);
      return field;
    }

    container.appendChild(crearDetall("Nom complet", contacteActual.name));
    container.appendChild(crearDetall("Email", contacteActual.email));
    container.appendChild(crearDetall("Telèfon", contacteActual.phone || "No especificat"));
    container.appendChild(crearDetall("Data", dataFormatejada));
    container.appendChild(crearDetall("Assumpte", contacteActual.subject));

    if (contacteActual.message) {
      container.appendChild(crearDetall("Missatge", contacteActual.message));
    }

    detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function obrirEdicio() {
    if (!contacteActual) return;

    document.getElementById("editName").value = contacteActual.name;
    document.getElementById("editEmail").value = contacteActual.email;
    document.getElementById("editPhone").value = contacteActual.phone || "";
    document.getElementById("editSubject").value = contacteActual.subject;

    detailSection.classList.remove("active");
    editSection.classList.add("active");
    amagarTaula();
    editSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function tancarDetall() {
    detailSection.classList.remove("active");
    mostrarTaulaSiToca();
  }

  function tancarEdicio() {
    editSection.classList.remove("active");
    contacteActual = null;
    mostrarTaulaSiToca();
  }

  // ===== Notificacions (toast) =====
  function showNotification(type, message, duration = 3000) {
    let container = document.getElementById("notificationContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "notificationContainer";
      container.classList.add("notification-container");
      document.body.appendChild(container);
    }

    const notif = document.createElement("div");
    notif.classList.add("notification");

    if (type === "success") notif.classList.add("success");
    if (type === "danger") notif.classList.add("danger");
    if (type === "error") notif.classList.add("error");

    notif.textContent = message;
    container.appendChild(notif);

    // Forzar reflow para que la transición funcione
    requestAnimationFrame(() => {
      notif.classList.add("show");
    });

    // Ocultar después de X ms
    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => {
        if (notif.parentNode === container) {
          container.removeChild(notif);
        }
      }, 250);
    }, duration);
  }



  async function guardarEdicio(event) {
    event.preventDefault();

    // Validació HTML5 del formulari
    if (!editForm.checkValidity()) {
      editForm.reportValidity();
      return;
    }

    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const subject = document.getElementById('editSubject').value.trim();

    if (contacteActual) {
      const contacteActualitzat = {
        ...contacteActual,
        name,
        email,
        phone: phone || '',
        subject,
        date: new Date().toISOString()
      };

      try {
        await updateId(url, 'Contact', contacteActual.id, contacteActualitzat);

        tancarEdicio();
        mostrarTaulaSiToca();
        carregarContactes();

        showNotification("success", "Contacte actualitzat correctament.");
      } catch (error) {
        console.error('Error al actualitzar el contacte:', error);
        showNotification("error", "Error al actualitzar el contacte.");
      }
    }
  }



  // ===== Eliminación =====
  function obrirModalConfirmacio() {
    if (!contacteActual) return;
    obrirModal(confirmModal);
  }

  async function eliminarContacte() {
    if (!contacteActual) return;

    try {
      await deleteData(url, 'Contact', contacteActual.id);
      tancarModal(confirmModal);
      tancarDetall();
      tancarEdicio();
      mostrarTaulaSiToca();
      carregarContactes();

      showNotification("danger", "Contacte eliminat correctament.");
    } catch (error) {
      console.error('Error al eliminar el contacte:', error);
      showNotification("error", "Error al eliminar el contacte.");
    }
  }


  // ===== Helpers modales =====
  function obrirModal(modal) {
    modal.classList.add("active");
  }

  function tancarModal(modal) {
    modal.classList.remove("active");
  }

  // ==== Arranque ====
  inicialitzar();
}
