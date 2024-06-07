const modal = document.querySelector("dialog");
const buttonClose = document.getElementById("botao-fechar");
let token = 'naoLogou';

function openModal() {
    modal.showModal()
}
buttonClose.onclick = function () {
    modal.close()
}

let login = document.getElementById('login');
let senha = document.getElementById('senha');

function realizarLogin() {

    if (login.value != "" || senha.value != "") {
        document.getElementById('usuario').innerHTML = login.value;
        if (login.value === "admin" && senha.value === "12345") {
            token = 'admin';
            JSON.stringify(token);
            localStorage.setItem("token", token);
            modal.close();
        }else{
            token = 'user';
            JSON.stringify(token);
            localStorage.setItem("token", token);
            modal.close();
        }

    } else {
        document.getElementById('respostaLogin').innerHTML = "Preencha todos os campos";
    }
}