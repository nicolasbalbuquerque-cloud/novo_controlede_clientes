// POO: Classe que representa a entidade Cliente
export class Cliente {
    constructor(id, nome, email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}

// POO: Classe responsável pelas chamadas assíncronas de API (RESTful)
export class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async obterTodos() {
        const resposta = await fetch(this.baseUrl);
        if (!resposta.ok) throw new Error("Falha ao consultar banco remoto.");
        const dados = await resposta.json();
        
        // Programação Funcional: map() transforma objetos puros da API em instâncias de Cliente
        return dados.map(c => new Cliente(c._id, c.nome, c.email));
    }

    async salvar(clienteDados) {
        const resposta = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteDados)
        });
        if (!resposta.ok) throw new Error("Erro ao salvar dados.");
        return await resposta.json();
    }

    async deletar(id) {
        const resposta = await fetch(`${this.baseUrl}/${id}`, {
            method: "DELETE"
        });
        if (!resposta.ok) throw new Error("Erro ao tentar deletar o registro.");
        return true;
    }
}