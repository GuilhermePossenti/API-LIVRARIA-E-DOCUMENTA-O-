class RepositoryBase {
    constructor() {
        this.nextId = 1;
    }

    async getNextId() {
        try {
            const items = await this.findAll();
            if (items.length === 0) {
                return 1;
            }
            const maxId = Math.max(...items.map(item => item.id));
            return maxId + 1;
        } catch (error) {
            return 1;
        }
    }

    // Métodos abstratos que devem ser implementados pelas classes filhas
    async findAll() {
        throw new Error("Método findAll() deve ser implementado");
    }

    async findById(id) {
        throw new Error("Método findById() deve ser implementado");
    }

    async create(data) {
        throw new Error("Método create() deve ser implementado");
    }

    async update(id, data) {
        throw new Error("Método update() deve ser implementado");
    }

    async delete(id) {
        throw new Error("Método delete() deve ser implementado");
    }
}

module.exports = RepositoryBase;