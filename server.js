//usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()
const db = require("./db")

// upload arquivo (multer e body-parser)
const bodyParser= require('body-parser');
const multer = require('multer');
server.use(bodyParser.urlencoded({extended: true}));

// configurando armazenamento das imagens

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads')
    },
    filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage });



//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))
server.use(express.static("uploads"));


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


server.post("/", upload.single("image"),function(req,res,next){
    //INSERIR DADOS NA TABELA

    console.log(req.file);
    const file = req.file;
    if (!file) {
        const error = new Error('Adicione uma imagem!');
        error.httpStatusCode = 400;
        return next(error);
    }

    imageurl = file.filename

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
        imageurl,
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

        return res.render("confirmAdd.html")
    })        

})

server.get("/del/:id", function(req,res){

    //Recebendo o ID da ideia a ser excluida como paramentro
    const id = req.params.id
    
    db.run(`DELETE FROM ideias WHERE id = ?`, id, function(err){
        if(err) {
            console.log(err)
            
        }
        //retorna uma pagina de confirmação caso a exclusão tenha sido bem sucedida
        return res.render("confirmDel.html")
    }) 
 
})

//liguei o servidor na porta 3000
server.listen(3000)
