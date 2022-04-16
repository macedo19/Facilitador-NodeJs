// Fazendo o require
const mysql = require('mysql')

// Criando conexão com o banco e setando um limite de execução de querys
const pool =mysql.createConnection({
    connectionLimit: 10, //Limite
    host: 'localhost', //host
    user: 'root', //username
    password: '', //senha por default vazia
    database: 'nodemysql2' //database que quero utilizar
})

// Exportando o modulo para pdoer ser usado na aplicação
module.exports = pool

// Esse é um recurso de cache nas query
// Ele mata caso ultrapasse o limite