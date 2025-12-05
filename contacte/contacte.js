document.addEventListener("DOMContentLoaded",main);
  
async function main(){
const form = document.getElementById("contactForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // 2) Recolectar valors (ja sabem que són vàlids)
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const phone   = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();

    // Si vols restringir una mica els caràcters:
    /*
    const subjectRegex = /^[A-Za-zÀ-ÿ0-9\s.,!?¡¿-]{5,300}$/;
    if (!subjectRegex.test(subject)) {
      alert("L'assumpte conté caràcters no permesos.");
      return;
    }
    */

    const nouMissatge = {
      name,
      email,
      phone: phone || "",
      subject,
      date: new Date().toISOString()
    };

    try {
      await postData(url, "Contact", nouMissatge);

      alert("Missatge enviat correctament!");
      form.reset();

    } catch (error) {
      console.error("Error enviant a la API:", error);
      alert("Error enviant el missatge.");
    }
  });
};



