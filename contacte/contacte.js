document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();

    // Validaciones
    if (!name || !email || !subject) {
      alert("Tots els camps obligatoris han d'estar emplenats.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("El correu electrònic no és vàlid.");
      return;
    }

    if (phone && !/^\d{9,15}$/.test(phone)) {
      alert("El telèfon ha de contenir només números (9-15 dígits).");
      return;
    }

    // Crear un nuevo mensaje con la información del formulario
    const nouMissatge = {
      id: Date.now(), // ID único basado en el timestamp
      name,
      email,
      phone: phone || '',
      subject,
      date: new Date().toISOString()
    };

    // Obtener los mensajes guardados en localStorage (si existen)
    let contactes = JSON.parse(localStorage.getItem("contactes")) || [];
    // Agregar el nuevo mensaje al array de contactos
    contactes.push(nouMissatge);
    // Guardar el array actualizado en localStorage
    localStorage.setItem("contactes", JSON.stringify(contactes));

    alert("Missatge enviat correctament! Ens posarem en contacte aviat.");
    form.reset(); // Limpiar el formulario después de enviar
  });
});
