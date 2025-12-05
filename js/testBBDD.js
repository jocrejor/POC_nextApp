document.addEventListener("DOMContentLoaded", main);

async function main() {
   const user = getIdData(url, "User","4")
    console.log(user);
    document.getElementById("resposta").innerText = JSON.stringify( await user );
}