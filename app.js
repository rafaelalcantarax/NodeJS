const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

// ===== Servidor =====
app.listen(3000, () => {
    console.log("Servidor rodando no http://localhost:3000");
});

// ===== Configuração do Body Parser =====
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ===== Configuração das views =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== Conexão com MySQL =====
const db = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: '12345',
  database: 'node'
});


// Testando conexão
db.connect(err => {
    if(err){
        console.log("Não foi possível conectar ao banco de dados", err);
    } else {
        console.log("Conectado ao banco de dados MySQL");
    }
});

// ===== Rotas =====

// Página inicial - listar clientes
app.get('/', (req, res) => {
    db.query("SELECT * FROM clientes", (err, results) => {
        if(err) throw err;
        res.render('index', { lista: results });
    });
});

// Página de cadastro
app.get('/registrar', (req, res) => {
    res.render('cadastro', { mensagem: null });
});

// Receber formulário de cadastro
app.post('/registrar', (req, res) => {
    let nome = req.body.Nome;
    let sobrenome = req.body.sobrenome;
    let empresa = req.body.empresa;

    db.query(
        "INSERT INTO clientes (nome, sobrenome, empresa) VALUES (?, ?, ?)",
        [nome, sobrenome, empresa],
        (err, result) => {
            if(err) throw err;
            console.log("Cliente cadastrado com sucesso!");
            res.render('cadastro', { mensagem: "Cadastro realizado com sucesso!" });
        }
    );
});
