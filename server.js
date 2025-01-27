const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Adicione esta linha
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createPool({
  host: 'roundhouse.proxy.rlwy.net',
  user: 'root',
  password: 'GVIWzfMizWHmKnjFgDCAaLNBtzlOKnOo',
  database: 'railway',
  port: 40528,
});

// Teste de conexão com o banco de dados
db.getConnection((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados bem-sucedida!');
  }
});

// Rotas GET

// Listar todos os clientes
app.get('/clients', (req, res) => {
  const query = 'SELECT * FROM Clients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      res.status(500).send('Erro ao buscar clientes');
    } else {
      res.status(200).json(results);
    }
  });
});

// Listar todos os agendamentos
app.get('/appointments', (req, res) => {
  const query = 'SELECT * FROM Appointments';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos:', err);
      res.status(500).send('Erro ao buscar agendamentos');
    } else {
      res.status(200).json(results);
    }
  });
});

// Listar todos os médicos
app.get('/doctors', (req, res) => {
  const query = 'SELECT * FROM Doctors';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar médicos:', err);
      res.status(500).send('Erro ao buscar médicos');
    } else {
      res.status(200).json(results);
    }
  });
});

// Listar todas as clínicas
app.get('/clinics', (req, res) => {
  const query = 'SELECT * FROM Clinics';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar clínicas:', err);
      res.status(500).send('Erro ao buscar clínicas');
    } else {
      res.status(200).json(results);
    }
  });
});

// Listar todas as especialidades
app.get('/specialties', (req, res) => {
  const query = 'SELECT * FROM Specialties';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar especialidades:', err);
      res.status(500).send('Erro ao buscar especialidades');
    } else {
      res.status(200).json(results);
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
