//As linhas abaixo são para abrir a tela de login e a tela do carrinho respectivamente

const modal = document.getElementById('modalAdicionarItens');
const buttonClose = document.getElementById("botao-fechar");
const modalCarrinho = document.getElementById('modalCarrinho');
const fecharCarrinho = document.getElementById('botaoFechar');

function openModal() {
    modal.showModal()
}
function openCarrinho() {
    modalCarrinho.showModal();
}

buttonClose.onclick = function () {
    modal.close();
}

fecharCarrinho.onclick = function () {
    modalCarrinho.close();
}

//Inicio do CRUD

const listaDeCompras = JSON.parse(localStorage.getItem('listaDeCompras')) || [];
let listaCarrinho = [];


function salvarLista() {
    localStorage.setItem('listaDeCompras', JSON.stringify(listaDeCompras));
}

function limpar() {
    document.getElementById('item').value = '';
    document.getElementById('valor').value = '';
}

function validarForm() {
    let item = document.getElementById('item').value;
    let valor = parseFloat(document.getElementById('valor').value).toFixed(2);

    if (!item || !isNaN(valor)) {
        alert("Preencha os campos");
        return false;
    } else {
        return true;
    }
}

function create() {
    if (validarForm) {
        let item = document.getElementById('item').value;
        let valor = parseFloat(document.getElementById('valor').value).toFixed(2);
        let caminhoImagemIcone = escolherImagemTipo();
        let descricao = document.getElementById('descricao').value;
        let urlImagem = document.getElementById('imagem').value;

        //pergunta para o array se existe um obj extritamente igual ao item do input
        let indiceExistente = -1;
        let objExistente = listaDeCompras.find(
            (objElemento, indiceObj) => {
                if (objElemento.item === item) {
                    indiceExistente = indiceObj;
                    return true;
                } else {
                    return false;
                }
            }
        );

        if (indiceExistente >= 0) {
            listaDeCompras[indiceExistente] = { item, valor, caminhoImagemIcone, descricao, urlImagem };
        } else {
            listaDeCompras.push({ item, valor, caminhoImagemIcone, descricao, urlImagem });
            listaCarrinho.push({ item, valor, urlImagem });
        }

        salvarLista();
        limpar();
        read();
    }
}

function read() {
    let listagem = document.getElementById('listagem');
    listagem.innerHTML = '';

    listaDeCompras.forEach(
        (obj, indice) => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${obj.urlImagem}" id='imagemPrincipal'></td>
                <td id='itemTd'>${obj.item}</td>
                <td id='valorTd'>R$${obj.valor}</td>
                <td id='botoesTable'>
                    <button class="button-editar" onclick="update(${indice})" id='editar'>Editar</button>
                    <button class="button-excluir" onclick="excluir(${indice})" id='excluir'>Excluir</button>
                </td>
                <td>
                    <button onclick="adicionarCarrinho(${indice})" id='botaoAddCarrinho'>Adicionar ao Carrinho</button>
                </td>  
                <td id='descricaoTd'>${obj.descricao}</td>
            `;
            listagem.appendChild(tr);
        });
}

function update(indice) {
    const obj = listaDeCompras[indice];
    document.getElementById('item').value = obj.item;
    document.getElementById('valor').value = obj.valor;
    document.getElementById('tipo').value = obj.tipo;
    document.getElementById('descricao').value = obj.descricao;
    document.getElementById('imagem').value = obj.urlImagem;
}

function atualizarValorTotal() {
    let valorTotal = listaDeCompras.reduce((total, item) => total + item.valor, 0);
    document.getElementById('valor-total').textContent = `Valor Total: R$ ${valorTotal.toFixed(2)}`;
}

function excluir(indice) {
    if (confirm(`Tem certeza que deseja excluir o item ${listaDeCompras[indice].item}?`)) {
        listaDeCompras.splice(indice, 1);
        salvarLista();
        read();
    }
}

function escolherImagemTipo() {
    let tipo = document.getElementById('tipo');
    if (tipo.value == 'eletronico') {
        return 'power.png';
    } else if (tipo.value == 'geral') {
        return 'world.png';
    } else if (tipo.value == 'livro') {
        return 'open-book.png';
    } else if (tipo.value == 'ferramentas') {
        return 'wrench.png';
    } else if (tipo.value == 'consumiveis') {
        return 'grocery.png';
    } else if (tipo.value == 'roupa') {
        return 'casual-t-shirt-.png';
    }
}

//caso o usuario digitado anteriormente nao seja admin desabilita os botoes
function desabilitarBotaoADM() {
    let tokenString = localStorage.getItem('token');
    if (tokenString != "admin") {
        document.getElementById("adicionarItem").style.display = "none";
        document.getElementById("adicionarItem").disabled = true;
        // Desabilitar e esconder botões de editar e excluir
        let editarButtons = document.querySelectorAll('.button-editar');
        let excluirButtons = document.querySelectorAll('.button-excluir');

        editarButtons.forEach(button => {
            button.style.display = "none";
            button.disabled = true;
        });

        excluirButtons.forEach(button => {
            button.style.display = "none";
            button.disabled = true;
        });
    }
}

function adicionarCarrinho(indice) {
    let obj = listaDeCompras[indice];
    let carrinho = document.getElementById('itensAdicionados');
    let tr = document.createElement("tr");

    tr.innerHTML = `
                <td><img src="${obj.urlImagem}" id='imgTd'></td>
                <td id='itemCar'>${obj.item}</td>
                <td id='valorCar'>R$ ${obj.valor}</td>
                <td>
                    <button onclick="excluirCarrinho(this, ${indice})" id="delete-button"><svg class="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg></button>
                </td>
            `;
    carrinho.appendChild(tr);
    let contador = document.getElementById('contador');
    let valorAtual = parseInt(contador.textContent);
    contador.textContent = valorAtual + 1;

    let carrinhoItens = JSON.parse(localStorage.getItem('carrinhoItens')) || [];
    carrinhoItens.push(obj);
    localStorage.setItem('carrinhoItens', JSON.stringify(carrinhoItens));
}

function excluirCarrinho(button, indice) {
    let trPai = button.closest('tr'); // acesso ao tr pai do botão
    trPai.remove(); // remove o tr pai do botão
    let contador = document.getElementById('contador');
    let valorAtual = parseInt(contador.textContent);
    contador.textContent = valorAtual - 1;
}


telaCarrinho = document.getElementById('btnFinalizarCompra')

telaCarrinho.onclick = function(){
    let tokenString = localStorage.getItem('token');
    if(tokenString == 'naoLogou'){
        alert('Você precisa estar logado para finalizar a compra');
    }else{
        window.location.href = 'carrinho.html';
    }
}

read();
desabilitarBotaoADM();