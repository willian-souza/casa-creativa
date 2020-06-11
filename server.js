//usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()
const db = require("./db")


//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))



//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express:server,
    noCache: true,
})

//criei uma rota "/"
//e capturo o pedido do cliente
server.get("/", function(req,res){

    db.all(`SELECT * FROM ideias`, function(err,rows){
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeias  = [...rows].reverse()

        //Mandando para o front apenas as duas ultimas ideias
        let lastIdeias = []
        for (let ideia of reversedIdeias){
            if(lastIdeias.length < 2){
                lastIdeias.push(ideia)
            }
        }

        return res.render("index.html", {ideias: lastIdeias })
    })


    
})

server.get("/ideias", function(req,res){
    db.all(`SELECT * FROM ideias`, function(err,rows){
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }
        
        const reversedIdeias  = [...rows].reverse()

        return res.render("ideias.html", {ideias: reversedIdeias})

    })
})


server.post("/", function(req,res){
    //INSERIR DADOS NA TABELA
    const query = `
        INSERT INTO ideias(
            image,
            title,
            category,
            description, 
            link
        )VALUES (?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function(err){
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        return res.redirect("/ideias")
    })        

})

//liguei o servidor na porta 3000
server.listen(3000)
