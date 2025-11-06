const app = require("./config/express");
const db = require("./database/sqlite");


console.log('db importado:', db);
console.log('Tipo de db.init:', typeof db.init);

db.init();


// Todas as rotas da aplicação
const routes = require("./routes");
// Configura o middleware de tratamento de erros
const errorHandler = require("./middlewares/errorHandler");
// Configura as rotas
app.use("/api", routes);
app.use(errorHandler);
// Handler para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});

addColumns();

module.exports = app;