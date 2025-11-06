const UsersRepository = require('../repositories/users.repository');
const bcrypt = require('bcrypt');

class AuthController {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async register(req, res, next) {
        try {
            const { email, fullName, password } = req.body;

            if (!email || !fullName || !password) {
                return res.status(400).json({ erro: 'Email, nome completo e senha são obrigatórios' });
            }

            const existingUser = await this.usersRepository.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ erro: 'Usuário já existe' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                email,
                fullName,
                password: hashedPassword
            };

            const userId = await this.usersRepository.create(user);
            res.status(201).json({ mensagem: 'Usuário registrado com sucesso', userId });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
            }

            const user = await this.usersRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            req.session.userId = user.id;
            res.status(200).json({ mensagem: 'Login realizado com sucesso' });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }
                res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
