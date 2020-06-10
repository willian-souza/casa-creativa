//usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()



const ideias = [
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
        title: "Cursos de Programação",
        category: "Estudo",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url:"https://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
        title: "Exercícios",
        category: "Saúde",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url:"https://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
        title: "Meditação",
        category: "Saúde",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url:"https://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729001.svg",
        title: "Ler",
        category: "Entretenimento",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
        url:"https://rocketseat.com.br"
    },

]


//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express:server,
    noCache: true,
})

//criei uma rota "/"
//e capturo o pedido do cliente

server.get("/", function(req,res){

    const reversedIdeias  = [...ideias].reverse()

    //Mandando para o front apenas as duas ultimas ideias
    let lastIdeias = []
    for (let ideia of reversedIdeias){
        if(lastIdeias.length < 2){
            lastIdeias.push(ideia)
        }
    }

    return res.render("index.html", {ideias: lastIdeias })
})

server.get("/ideias", function(req,res){

    const reversedIdeias  = [...ideias].reverse()

    return res.render("ideias.html", {ideias: reversedIdeias})
})


//liguei o servidor na porta 3000
server.listen(3000)
