import { ApiService } from './classes.js';
import { mapearElementoCliente, gerenciarLoader, gerenciarBotaoExcluir } from './utils.js';

const API_URL = "https://crudcrud.com/api/9dbd133091294a22b39448637b613a61/clientes";
const api = new ApiService(API_URL);

// Objeto de cache para os elementos mapeados do DOM
const dom = {
    form: document.getElementById("form-cliente"),
    inputNome: document.getElementById("nome"),
    inputEmail: document.getElementById("email"),
    btnSalvar: document.getElementById("btn-salvar"),
    listaClientes: document.getElementById("lista-clientes"),
    msgListaVazia: document.getElementById("lista-vazia"),
    loader: document.getElementById("loader"),
    ledStatus: document.getElementById("api-status")
};

// Estado local da aplicação contendo os dados carregados em memória
let clientesLocal = [];

async function renderizarFluxoClientes() {
    dom.loader.classList.remove("oculto");
    
    try {
        clientesLocal = await api.obterTodos();
        
        dom.listaClientes.innerHTML = "";
        dom.ledStatus.classList.remove("erro");

        if (clientesLocal.length === 0) {
            dom.msgListaVazia.classList.remove("oculto");
        } else {
            dom.msgListaVazia.classList.add("oculto");
            
            // Renderização da lista a partir do array local
            clientesLocal.forEach(cliente => {
                const li = document.createElement("li");
                li.className = "cliente-item";
                li.innerHTML = mapearElementoCliente(cliente);
                dom.listaClientes.appendChild(li);
            });
        }
    } catch (erro) {
        console.error("Erro na operação GET:", erro);
        dom.ledStatus.classList.add("erro");
    } finally {
        dom.loader.classList.add("oculto");
    }
}

async function tratarFormulario(evento) {
    evento.preventDefault();
    
    const nome = dom.inputNome.value.trim();
    const email = dom.inputEmail.value.trim();

    if (!nome || !email) {
        alert("Por favor, preencha todos os campos antes de salvar.");
        return;
    }

    // Programação Funcional: find() valida duplicidade local de e-mail corporativo
    const emailExistente = clientesLocal.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (emailExistente) {
        alert("Atenção: Este e-mail corporativo já foi registrado.");
        return;
    }

    gerenciarLoader(true, dom);

    try {
        await api.salvar({ nome, email });
        dom.form.reset();
        await renderizarFluxoClientes();
    } catch (erro) {
        console.error("Erro na operação POST:", erro);
        dom.ledStatus.classList.add("erro");
        alert("Ocorreu um erro ao tentar salvar o cliente.");
    } finally {
        gerenciarLoader(false, dom);
    }
}

async function tratarCliqueLista(evento) {
    // Delegação de eventos dinâmica capturando elementos com a classe .btn-excluir
    if (evento.target.classList.contains("btn-excluir")) {
        const botaoClicado = evento.target;
        const idCliente = botaoClicado.getAttribute("data-id");
        
        if (!confirm("Tem certeza que deseja remover este cliente permanentemente?")) return;

        gerenciarBotaoExcluir(botaoClicado, true);
        dom.loader.classList.remove("oculto");

        try {
            await api.deletar(idCliente);
            await renderizarFluxoClientes();
        } catch (erro) {
            console.error("Erro na operação DELETE:", erro);
            dom.ledStatus.classList.add("erro");
            alert("Não foi possível excluir este cliente do servidor.");
            
            // Restaura o botão caso a requisição HTTP falhe
            botaoClicado.disabled = false;
            botaoClicado.textContent = "Remover";
            botaoClicado.style.backgroundColor = "";
            botaoClicado.style.color = "";
        } finally {
            dom.loader.classList.add("oculto");
        }
    }
}

// Manipulação limpa do DOM injetando os listeners nos alvos
dom.form.addEventListener("submit", tratarFormulario);
dom.listaClientes.addEventListener("click", tratarCliqueLista);
window.addEventListener("DOMContentLoaded", renderizarFluxoClientes);