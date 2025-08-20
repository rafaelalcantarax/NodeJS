const express = require ('express');
const app = express();
const mysql = require('mysql');

const bodyparser = require('body-parser');
const path = require('path');

app.listen('3000',()=>{
    console.log("servidor rodando, powerNodeJS");

});

//Body Parser 
app.set('view engine', 'ejs');
app.set('views engine', path.join(__dirname,'views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

//Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'',
  database:'node'

});

//testando conexão
db.connect(function(err){
    if(err){
        console.log("Não foi possivel conectar ao banco de dados")
    }
    var sql = "SELECT * FROM clientes";
    db.query(sql,function(err,results){
        console.log(results);
    });
});
app.get('/',(req,res)=>{
 let query = db.query("SELECT * FROM clientes",function(err,results){
    res.render('index',{lista:results});
})

});

app.get('/registrar',function(req,res){
    res.render('cadastro',{});
});

app.post('/registrar',function(req,res){
    console.log("cadastro realizado com sucesso");
    let nome = req.body.Nome;
    let sobrenome = req.body.sobrenome;
    let empresa = req.body.empresa;
    db.query("INSERT INTO clientes (nome,sobrenome,empresa) VALUES (?,?,?)",[nome,sobrenome,empresa],function(err,results){});
    res.render('cadastro',{});
})