function onOff(){

    document   
        .querySelector("#modal")
        .classList
        .toggle("hide")

    document
        .querySelector("body")
        .classList
        .toggle("hideScroll")

    document
        .querySelector("#modal")
        .classList
        .toggle("addScroll")
}

function checkFields(event){

    const valuesToCheck = [
        "title",
        "image",
        "category",
        "description",
        "link",
    ]

    const isEmpty = valuesToCheck.find(function(value){

        const checkIfString = typeof event.target[value].value === "string"
        const checkisEmpty = !event.target[value].value.trim()

        if(checkIfString && checkisEmpty){
            return true
        }
    })

    if(isEmpty){
        event.preventDefault()
        alert("Preencha todos os campos")
    }
    
}



function onOffConfirm(id){
    document   
        .querySelector("#modal-confirm-del")
        .classList
        .toggle("hideModalConfirm")

    //Setando,no href do botao, o ID da ideia que será excluida. Para que o mesmo possa acessar a rota de exclusão 
    document
        .querySelector("#modal-confirm-del a")
        .setAttribute("href",`/del/${id}`)
}

