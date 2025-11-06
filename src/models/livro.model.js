class Livro {
    constructor({ id, titulo, autor, ano_publicacao, genero, editora, numeroPaginas }) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano_publicacao = ano_publicacao;
        this.genero = genero;
        this.editora = editora;
        this.numeroPaginas = numeroPaginas;
    }

    static fromJSON(json) {
        return new Livro(json);
    }

    _validar() {
        const erros = [];
        
        if (!this.titulo || this.titulo.trim().length === 0) {
            erros.push('Título é obrigatório');
        }
        if (!this.autor || this.autor.trim().length === 0) {
            erros.push('Autor é obrigatório');
        }
        if (!this.categoria || this.categoria.trim().length === 0) {
            erros.push('Categoria é obrigatória');
        }
        if (!Number.isInteger(this.ano) || isNaN(this.ano)) {
            erros.push('Ano deve ser um número válido');
        }
        
        if (this.numeroPaginas !== null && (!Number.isInteger(this.numeroPaginas) || this.numeroPaginas <= 0)) {
            erros.push('Número de páginas deve ser um número inteiro positivo');
        }
        
        if (erros.length > 0) {
            const error = new Error('Dados inválidos');
            error.statusCode = 400;
            error.details = erros;
            throw error;
        }
    }

    static fromJSON(json) {
        return new Livro({
            id: json.id ?? null,
            titulo: json.titulo,
            autor: json.autor,
            categoria: json.categoria,
            ano: json.ano,
            editora: json.editora,
            numeroPaginas: json.numeroPaginas
        });
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            ano_publicacao: this.ano_publicacao,
            genero: this.genero,
            editora: this.editora,
            numeroPaginas: this.numeroPaginas
        };
    }
}

module.exports = Livro;