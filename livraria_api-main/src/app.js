const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();
const routes = require("./routes");
const app = require("./config/express");
const errorHandler = require("./middlewares/errorHandler");

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);
app.use((req, res) => {
res.status(404).json({ erro: "Endpoint não encontrado" });
});

// Caminho para o arquivo JSON
const caminhoArquivo = path.join(__dirname, 'data', 'livros.json');

// Função auxiliar para ler o arquivo JSON
async function lerArquivo() {
    try {
        const dados = await fs.promises.readFile(caminhoArquivo, 'utf8');
        return JSON.parse(dados);
    } catch (error) {
        return [];
    }
}

// Função auxiliar para salvar no arquivo JSON
async function salvarArquivo(dados) {
    const dir = path.dirname(caminhoArquivo);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    await fs.promises.writeFile(caminhoArquivo, JSON.stringify(dados, null, 2), 'utf8');
}

// Função para obter próximo ID
async function getProximoId() {
    const livros = await lerArquivo();
    if (livros.length === 0) return 1;
    return Math.max(...livros.map(l => l.id)) + 1;
}

// Rota inicial com documentação
app.get("/", (req, res) => {
    res.send(`
        <h1>Biblioteca Online</h1>
        <p>Use os endpoints:</p>
        <ul>
            <li>GET /livros → lista todos os livros</li>
            <li>GET /livros/:id → busca um livro pelo ID</li>
            <li>POST /livros → adiciona um livro (JSON: {titulo, autor, categoria, ano})</li>
            <li>PUT /livros/:id → atualiza um livro (JSON: {titulo, autor, categoria, ano})</li>
            <li>DELETE /livros/:id → remove livro pelo ID</li>
        </ul>
    `);
});

// Listar todos os livros
app.get("/livros", async (req, res) => {
    try {
        const livros = await lerArquivo();
        res.status(200).json(livros);
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        res.status(500).json({ erro: "Erro ao listar livros" });
    }
});

// Buscar livro por ID
app.get("/livros/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const livros = await lerArquivo();
        const livro = livros.find(l => l.id === id);
        
        if (!livro) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }
        
        res.status(200).json(livro);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        res.status(500).json({ erro: "Erro ao buscar livro" });
    }
});

// Adicionar novo livro
app.post("/livros", async (req, res) => {
    try {
        const { titulo, autor, categoria, ano } = req.body;
        
        if (!titulo || !autor || !categoria || !ano) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
        }
        
        const livros = await lerArquivo();
        const novoLivro = {
            id: await getProximoId(),
            titulo: titulo.trim(),
            autor: autor.trim(),
            categoria: categoria.trim(),
            ano: parseInt(ano)
        };
        
        livros.push(novoLivro);
        await salvarArquivo(livros);
        
        res.status(201).json({ 
            mensagem: "Livro adicionado com sucesso",
            livro: novoLivro
        });
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        res.status(500).json({ erro: "Erro ao criar livro" });
    }
});

// Atualizar livro
app.put("/livros/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { titulo, autor, categoria, ano } = req.body;
        
        if (!titulo || !autor || !categoria || !ano) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
        }

        const livros = await lerArquivo();
        const livroExistente = livros.find(l => l.id === id);
        
        if (!livroExistente) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }
        
        const livrosAtualizados = livros.map(livro => {
            if (livro.id === id) {
                return {
                    id: livro.id,
                    titulo: titulo.trim(),
                    autor: autor.trim(),
                    categoria: categoria.trim(),
                    ano: parseInt(ano)
                };
            }
            return livro;
        });
        
        await salvarArquivo(livrosAtualizados);
        const livroAtualizado = livrosAtualizados.find(l => l.id === id);
        
        res.status(200).json({
            mensagem: "Livro atualizado com sucesso",
            livro: livroAtualizado
        });
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ erro: "Erro ao atualizar livro" });
    }
});

// Remover livro
app.delete("/livros/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const livros = await lerArquivo();
        const index = livros.findIndex(l => l.id === id);
        
        if (index === -1) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }
        
        const [livroRemovido] = livros.splice(index, 1);
        await salvarArquivo(livros);
        
        res.status(200).json({
            mensagem: "Livro removido com sucesso",
            livro: livroRemovido
        });
    } catch (error) {
        console.error('Erro ao remover livro:', error);
        res.status(500).json({ erro: "Erro ao remover livro" });
    }
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

module.exports = app;