const express = require('express');
const morgan = require('morgan');
const app = express();
const session = require("express-session")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(session({
    secret: process.env.SESSION_SECRET || "livraria_secret_key",
    rolling: true, // renova a sessão a cada requisição
    cookie: {
        httpOnly: true,
        secure: false, // true apenas em produção HTTPS
        maxAge: 1000 * 60 * 60 * 2 // 2 horas
    }
}));
module.exports = app;
