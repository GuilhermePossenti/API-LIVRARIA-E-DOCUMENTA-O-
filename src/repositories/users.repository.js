const { run, get, all } = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
    constructor() {
        this.tableName = 'users';
    }

    async create(user) {
        const sql = `INSERT INTO ${this.tableName} (email, fullName, password) VALUES (?, ?, ?)`;
        const result = run(sql, [user.email, user.fullName, user.password]);
        return result.lastInsertRowid;
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const row = get(sql, [email]);
        if (row) {
            return new User(row.id, row.email, row.fullName, row.password);
        }
        return null;
    }

    async findById(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const row = get(sql, [id]);
        if (row) {
            return new User(row.id, row.email, row.fullName, row.password);
        }
        return null;
    }

    async update(id, user) {
        const sql = `UPDATE ${this.tableName} SET email = ?, fullName = ?, password = ? WHERE id = ?`;
        run(sql, [user.email, user.fullName, user.password, id]);
    }

    async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        run(sql, [id]);
    }

    async findAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        const rows = all(sql);
        return rows.map(row => new User(row.id, row.email, row.fullName, row.password));
    }
}

module.exports = UsersRepository;
