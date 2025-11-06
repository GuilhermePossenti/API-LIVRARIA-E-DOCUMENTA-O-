const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ erro: 'Acesso negado. Faça login para continuar.' });
    }
    next();
};

module.exports = authMiddleware;
