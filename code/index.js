
// REQUIRE DO EXPRESS, HANDLEBARS, DB
const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

//APP 
const app = express()

// PEGANDO DO BODY OS DADOS E TRANSFORMANDO EM JSON PARAUTILIZAR
app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())
// -------------------------------

// Handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
// ----------------------

// CSS
app.use(express.static('public'))
// ------------------------

// renderizando o home
app.get('/', (req, res) => {
    res.render('home')
  
})

// Inserção de dados pelo posrt do form
app.post('/books/insertbooks', (req, res) => {
    // dados vindo do body
    const title = req.body.title
    const pageqty = req.body.pageqty

    //Query a ser executada
    const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`

    //Execução da query
    pool.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        // Redireciona caso seja o sucesso
        res.redirect('/books')
    })
})

// UMA OUTRA MANEIRA QUE SERIA MAIS SEGURA É PREPARANDO OS DADOS COMO MOSTRO NO EXEMPLO A SEGUIR
// Nas colunas da query eu utilizo ?? e nos valores ?
// const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`

// Seguir a mesma sequencia da query no array
// const data = ['title', 'pageqty', title, pageqty]


// //Execução da query passando a const data 
// pool.query(sql, data,function(err){
//     if(err){
//         console.log(err)
//         return
//     }

//     // Redireciona caso seja o sucesso
//     res.redirect('/books')
// })
// -------------------------------------



// SELECT ALL
// O app get tem na sequencia de parametros qual é a handlebars que quero pegar , seguindo de uma function anonima
app.get('/books', (req, res) => {
    // Query
    const sql = "SELECT * FROM books"

    // Execução
    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const books = data
        console.log(books)

        res.render('books', {books})
    })
})
// ---------------------------------


// SELEC POR ID
// O app get tem na sequencia de parametros qual é a handlebars que quero pegar . No caminho opsso setar de forma dinamica o parametro que esta vindo, seguindo de uma function anonima
app.get('/books/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE id = ${id}`

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        // Se ocorrer tudo bem ira renderizar outra pagiga do handlebars, ao qual estarei passando os dados book
        res.render('book', {book})
    })
})
// --------------------------------

// EDIT POR ID
// O app get tem na sequencia de parametros qual é a handlebars que quero pegar . No caminho opsso setar de forma dinamica o parametro que esta vindo, seguindo de uma function anonima

app.get('/books/edit/:id', (req, res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`

    
    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        // Se ocorrer tudo bem ira renderizar outra pagiga do handlebars, ao qual estarei passando os dados book
        res.render('editbook', {book})
    })
})
// -------------------------------

// UPDATE
// O post é a action que esta no form do html, o caminho utilizado la é o que levara para esse metodo
app.post('/books/updatebook', (req, res) => {
    // Dados vindo do body
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    // Query
    const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}` 

    // Execução da query
    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]
        
        // Caso não ocorra erros será redirecionado ao handlerbars books
        res.redirect('/books')
    })
})
// -------------------------------

// DELETE
// O post é a action que esta no form do html, o caminho utilizado la é o que levara para esse metodo
app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM books where id = ${id}`

    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        // Caso não ocorra erros será redirecionado ao handlerbars books
        res.redirect('/books')
    })
})
// ------------------------------
// Rodando a aplicação na port 3000
app.listen(3000)
// -------------------------------------------