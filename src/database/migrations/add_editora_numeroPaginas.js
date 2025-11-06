const db = require('../sqlite');

const addColumns = async () => {
  try {
    // Adiciona coluna editora
    await db.run('ALTER TABLE livros ADD COLUMN editora TEXT');
    console.log('Coluna editora adicionada com sucesso');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('Coluna editora já existe');
    } else {
      throw error;
    }
  }

  try {
    // Adiciona coluna numeroPaginas
    await db.run('ALTER TABLE livros ADD COLUMN numeroPaginas INTEGER');
    console.log('Coluna numeroPaginas adicionada com sucesso');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('Coluna numeroPaginas já existe');
    } else {
      throw error;
    }
  }
};

module.exports = addColumns;