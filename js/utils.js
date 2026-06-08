export const mapearElementoCliente = (cliente) => {
    return `
        <div class="cliente-info">
            <strong>${cliente.nome}</strong>
            <span>${cliente.email}</span>
        </div>
        <button class="btn-excluir" data-id="${cliente.id}">Remover</button>
    `;
};

// Gerencia o spinner central e muda o texto do botão principal
export const gerenciarLoader = (carregando, elementos) => {
    const { loader, btnSalvar } = elementos;
    if (carregando) {
        loader.classList.remove("oculto");
        btnSalvar.disabled = true;
        btnSalvar.textContent = "Salvando..."; // <-- Indicador Visual aqui!
        btnSalvar.style.opacity = "0.7";
    } else {
        loader.classList.add("oculto");
        btnSalvar.disabled = false;
        btnSalvar.textContent = "Cadastrar Cliente";
        btnSalvar.style.opacity = "1";
    }
};

// Muda o texto do botão de exclusão específico da linha
export const gerenciarBotaoExcluir = (botao, excluindo) => {
    if (!botao) return;
    if (excluindo) {
        botao.disabled = true;
        botao.textContent = "Excluindo..."; // <-- Indicador Visual aqui!
        botao.style.backgroundColor = "#EF4444";
        botao.style.color = "#FFFFFF";
    }
};