document.addEventListener("DOMContentLoaded", main);

async function main() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const formMessage = document.getElementById("formMessage");

  const nameInput    = document.getElementById("name");
  const emailInput   = document.getElementById("email");
  const phoneInput   = document.getElementById("phone");
  const subjectInput = document.getElementById("subject");

  const nameError    = document.getElementById("nameError");
  const emailError   = document.getElementById("emailError");
  const phoneError   = document.getElementById("phoneError");
  const subjectError = document.getElementById("subjectError");

  function clearErrors() {
    // Limpiar textos de error
    if (nameError)    nameError.textContent = "";
    if (emailError)   emailError.textContent = "";
    if (phoneError)   phoneError.textContent = "";
    if (subjectError) subjectError.textContent = "";

    // Quitar borde rojo de los campos
    nameInput.classList.remove("input-error");
    emailInput.classList.remove("input-error");
    phoneInput.classList.remove("input-error");
    subjectInput.classList.remove("input-error");

    // Limpiar mensaje general
    if (formMessage) {
      formMessage.textContent = "";
      formMessage.className = "form-message";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const phone   = phoneInput.value.trim();
    const subject = subjectInput.value.trim();

    let isValid = true;

    // === VALIDACIONES ===

    // Nombre
    const nameRegex = /^[A-Za-zÀ-ÿ\s]{2,60}$/;
    if (!name) {
      nameError.textContent = "El nombre es obligatorio.";
      nameInput.classList.add("input-error");
      isValid = false;
    } else if (!nameRegex.test(name)) {
      nameError.textContent = "El nombre solo puede contener letras y espacios (2-60 caracteres).";
      nameInput.classList.add("input-error");
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.textContent = "El correo electrónico es obligatorio.";
      emailInput.classList.add("input-error");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = "El correo electrónico no tiene un formato válido.";
      emailInput.classList.add("input-error");
      isValid = false;
    }

    // Teléfono (opcional)
    const phoneRegex = /^\+?[0-9 ]{9,20}$/;
    if (phone && !phoneRegex.test(phone)) {
      phoneError.textContent =
        "El teléfono solo puede contener números, espacios y, opcionalmente, un + al principio (9-20 caracteres).";
      phoneInput.classList.add("input-error");
      isValid = false;
    }

    // Asunto
    if (!subject) {
      subjectError.textContent = "El asunto es obligatorio.";
      subjectInput.classList.add("input-error");
      isValid = false;
    } else if (subject.length < 5 || subject.length > 300) {
      subjectError.textContent = "El asunto debe tener entre 5 y 300 caracteres.";
      subjectInput.classList.add("input-error");
      isValid = false;
    }

    // Si hay errores → mensaje general y no enviamos
    if (!isValid) {
      if (formMessage) {
        formMessage.textContent = "Revisa los campos marcados en rojo.";
        formMessage.classList.add("error");
      }
      return;
    }

    // Objeto a enviar si todo es válido
    const nouMissatge = {
      name,
      email,
      phone: phone || "",
      subject,
      date: new Date().toISOString()
    };

    try {
      // url y postData vienen de tu crud.js
      await postData(url, "Contact", nouMissatge);

      if (formMessage) {
        formMessage.textContent = "Mensaje enviado correctamente.";
        formMessage.classList.add("success");
      }

      form.reset();
    } catch (error) {
      console.error("Error enviando a la API:", error);

      if (formMessage) {
        formMessage.textContent = "Error enviando el mensaje. Inténtalo de nuevo más tarde.";
        formMessage.classList.add("error");
      }
    }
  });
}
