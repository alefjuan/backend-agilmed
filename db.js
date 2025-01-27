const { Sequelize } = require('sequelize');

// Credenciais do banco de dados
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, // Desabilitar logs de SQL para evitar poluição no terminal
});

sequelize
  .authenticate()
  .then(() => console.log('Conexão com o banco de dados bem-sucedida!'))
  .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

module.exports = sequelize;
