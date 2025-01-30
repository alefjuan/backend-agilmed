const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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


// Criar um novo agendamento
app.post('/appointments', (req, res) => {
  const { date, time, client_id, doctor_id } = req.body;

  if (!date || !time || !client_id || !doctor_id) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const query = 'INSERT INTO Appointments (date, time, client_id, doctor_id) VALUES (?, ?, ?, ?)';
  db.query(query, [date, time, client_id, doctor_id], (err, result) => {
    if (err) {
      console.error('Erro ao criar agendamento:', err);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
    res.status(201).json({ message: 'Agendamento criado com sucesso', id: result.insertId });
  });
});

const bcrypt = require('bcrypt'); // Para criptografar a senha

// Criar um novo cliente
app.post('/clients', async (req, res) => {
  const { name, email, cpf, password, telephone } = req.body;

  if (!name || !email || !cpf || !password) {
    return res.status(400).json({ error: 'Nome, email, CPF e senha são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO Clients (name, email, cpf, password, telephone) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, cpf, hashedPassword, telephone], (err, result) => {
      if (err) {
        console.error('Erro ao criar cliente:', err);
        return res.status(500).json({ error: 'Erro ao criar cliente' });
      }
      res.status(201).json({ message: 'Cliente criado com sucesso', id: result.insertId });
    });
  } catch (error) {
    console.error('Erro ao criptografar senha:', error);
    res.status(500).json({ error: 'Erro interno ao criar cliente' });
  }
});

// Login do cliente
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const query = 'SELECT * FROM Clients WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err);
      return res.status(500).json({ error: 'Erro ao buscar cliente' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const client = results[0];

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, client.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.status(200).json({
      message: 'Login bem-sucedido',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        cpf: client.cpf,
        telephone: client.telephone,
      },
    });
  });
});
app.get('/appointments/client/:client_id', (req, res) => {
  const { client_id } = req.params;
  const query = 'SELECT * FROM Appointments WHERE client_id = ?';
  db.query(query, [client_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar agendamentos por ID do cliente:', err);
      res.status(500).send('Erro ao buscar agendamentos por ID do cliente');
    } else {
      res.status(200).json(results);
    }
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
