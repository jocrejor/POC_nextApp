document.addEventListener("DOMContentLoaded", () => {
  const contactesList = document.getElementById("contactesList");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const backBtn = document.getElementById("backBtn");

  // Modals
  const detailModal = document.getElementById("detailModal");
  const editModal = document.getElementById("editModal");
  const confirmModal = document.getElementById("confirmModal");

  // Botones de modals
  const closeDetailBtn = document.getElementById("closeDetailBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

  // Formulario de edición
  const editForm = document.getElementById("editForm");

  // Variables para gestionar el estado
  let contacteActual = null;
  let contactes = [];

  // Inicializar la aplicación
  function inicialitzar() {
    carregarContactes();
    configurarEventListeners();
  }

  // Configurar event listeners
  function configurarEventListeners() {
    // Búsqueda
    searchInput.addEventListener('input', cercarContactes);
    clearSearchBtn.addEventListener('click', netejarCerca);

    // Navegación
    backBtn.addEventListener('click', () => {
      window.location.href = 'contacte.html';
    });

    // Modals - Cerrar con X
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', tancarTotsModals);
    });

    // Modal de detalle
    closeDetailBtn.addEventListener('click', () => detailModal.style.display = 'none');
    editBtn.addEventListener('click', obrirModalEditar);
    deleteBtn.addEventListener('click', obrirModalConfirmacio);

    // Modal de edición
    cancelEditBtn.addEventListener('click', () => editModal.style.display = 'none');
    editForm.addEventListener('submit', guardarEdicio);

    // Modal de confirmación
    confirmDeleteBtn.addEventListener('click', eliminarContacte);
    cancelDeleteBtn.addEventListener('click', () => confirmModal.style.display = 'none');

    // Cerrar modals al hacer clic fuera
    window.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.style.display = 'none';
      if (e.target === editModal) editModal.style.display = 'none';
      if (e.target === confirmModal) confirmModal.style.display = 'none';
    });
  }

  // Función para obtener todos los contactos desde la API
  async function obtenerTotsElsContactes() {
    try {
      const contactesAPI = await getData(url, 'Contact');
      return contactesAPI;
    } catch (error) {
      console.error("Error obteniendo contactos desde la API:", error);
      return [];
    }
  }

  // Función para cargar y mostrar los contactos
  async function carregarContactes(contactesFiltrats = null) {
    contactes = contactesFiltrats || await obtenerTotsElsContactes();
    contactesList.innerHTML = '';

    if (!contactes || contactes.length === 0) {
      contactesList.innerHTML = '<div class="no-results">No s\'han trobat contactes.</div>';
      return;
    }

    contactes.forEach(contacte => {
      const contacteCard = crearContacteCard(contacte);
      contactesList.appendChild(contacteCard);
    });
  }

  // Función para crear una tarjeta de contacto
  function crearContacteCard(contacte) {
    const card = document.createElement('div');
    card.className = 'contacte-card';
    card.dataset.id = contacte.id;

    // Formatejar la data
    const dataFormatejada = new Date(contacte.date).toLocaleString('ca-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    card.innerHTML = `
      <div class="contacte-header">
        <h3 class="contacte-name">${contacte.name}</h3>
        <span class="contacte-date">${dataFormatejada}</span>
      </div>
      <div class="contacte-info">
        <div class="contacte-field">
          <span class="contacte-label">Email</span>
          <span class="contacte-value">${contacte.email}</span>
        </div>
        <div class="contacte-field">
          <span class="contacte-label">Telèfon</span>
          <span class="contacte-value">${contacte.phone || 'No especificat'}</span>
        </div>
      </div>
      <div class="contacte-subject">
        <div class="subject-label">Assumpte</div>
        <div class="subject-value">${contacte.subject}</div>
      </div>
    `;

    // Event listener para ver detalles
    card.addEventListener('click', () => mostrarDetallsContacte(contacte.id));

    return card;
  }

  // Función para mostrar los detalles de un contacto
  function mostrarDetallsContacte(id) {
    contacteActual = contactes.find(c => c.id == id);
    if (!contacteActual) return;

    const dataFormatejada = new Date(contacteActual.date).toLocaleString('ca-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    document.getElementById('contactDetail').innerHTML = `
      <div class="detail-field">
        <span class="detail-label">Nom complet</span>
        <div class="detail-value">${contacteActual.name}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Email</span>
        <div class="detail-value">${contacteActual.email}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Telèfon</span>
        <div class="detail-value">${contacteActual.phone || 'No especificat'}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Data</span>
        <div class="detail-value">${dataFormatejada}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Assumpte</span>
        <div class="detail-value">${contacteActual.subject}</div>
      </div>
    `;

    detailModal.style.display = 'block';
  }

  // Función para abrir el modal de edición
  function obrirModalEditar() {
    if (!contacteActual) return;
    // Rellenar el formulario de edición con los datos del contacto
    document.getElementById('editName').value = contacteActual.name;
    document.getElementById('editEmail').value = contacteActual.email;
    document.getElementById('editPhone').value = contacteActual.phone || '';
    document.getElementById('editSubject').value = contacteActual.subject;
    editModal.style.display = 'block';
  }

  // Función para abrir el modal de confirmación de eliminación
  function obrirModalConfirmacio() {
    if (!contacteActual) return;
    confirmModal.style.display = 'block';
  }

  // Función para guardar la edición de un contacto
  async function guardarEdicio(event) {
    event.preventDefault();

    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const subject = document.getElementById('editSubject').value.trim();

    if (!name || !email || !subject) {
      alert("Tots els camps obligatoris han d'estar emplenats.");
      return;
    }

    if (contacteActual) {
      contacteActual.name = name;
      contacteActual.email = email;
      contacteActual.phone = phone || '';
      contacteActual.subject = subject;
      contacteActual.date = new Date().toISOString();

      try {
        await updateId(url, 'Contact', contacteActual.id, contacteActual);
        editModal.style.display = 'none';
        carregarContactes();  // Recargar la lista de contactos después de la edición
        alert('Contacte actualitzat correctament.');
      } catch (error) {
        console.error('Error al actualizar el contacto:', error);
      }
    }
  }

  // Función para eliminar un contacto
  async function eliminarContacte() {
    if (!contacteActual) return;

    try {
      await deleteData(url, 'Contact', contacteActual.id);
      confirmModal.style.display = 'none';
      carregarContactes();  // Recargar la lista después de eliminar
      alert('Contacte eliminat correctament.');
    } catch (error) {
      console.error('Error al eliminar el contacto:', error);
    }
  }

  // Función para buscar contactos
  function cercarContactes() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      carregarContactes();
      return;
    }

    const contactesFiltrats = contactes.filter(contacte =>
      contacte.name.toLowerCase().includes(query) ||
      contacte.email.toLowerCase().includes(query) ||
      contacte.subject.toLowerCase().includes(query) ||
      (contacte.phone && contacte.phone.includes(query))
    );

    carregarContactes(contactesFiltrats);
  }

  // Función para limpiar la búsqueda
  function netejarCerca() {
    searchInput.value = '';
    carregarContactes();
  }

  // Función para cerrar todos los modals
  function tancarTotsModals() {
    detailModal.style.display = 'none';
    editModal.style.display = 'none';
    confirmModal.style.display = 'none';
  }

  // Inicializar la aplicación
  inicialitzar();
});
