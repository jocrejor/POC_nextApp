document.addEventListener("DOMContentLoaded", main);
const url = "https://api.serverred.es/"
function main() {
    let formulari = document.getElementById("formulariLogin");
    formulari.addEventListener("submit", comprova);
}

async function comprova(event) {
    
    event.preventDefault();
    
    
    document.getElementById("missatgeError").textContent = "";
    document.getElementById("missatgeExit").textContent = "";
    
    try {
        let usuaris = await getData(url + 'UserWC')
        
        let correu = document.getElementById("email").value;
        let contrasenya = document.getElementById("contrasenya").value;
        
        let usuariTrobat = usuaris.find(usuari => 
            usuari.email === correu && usuari.password === contrasenya
        );
        
        if (usuariTrobat) {
            
            document.getElementById("missatgeExit").textContent = "Inici de sessió correcte!" + usuariTrobat.name;
            
            localStorage.setItem("currentUser", JSON.stringify(usuariTrobat));
            
            setTimeout(() => {
                window.location.href = "../index.html"; 
            }, 2000);
            
        } else {

            document.getElementById("missatgeError").textContent = "Correu electrònic o contrasenya incorrectes.";
        }
        
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("missatgeError").textContent = "Error de connexió. Si us plau, torna-ho a intentar.";
    }
}