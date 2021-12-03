const socket = io();

/*Socket productos*/
socket.on('deliverProducts',data=>{
    let products = data.event;
    fetch('templates/productTable.handlebars')
    .then(string=> string.text())
    .then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const templateObject ={
            products:products   
        }
        const html = processedTemplate(templateObject);
        let div = document.getElementById('productTable');
        div.innerHTML=html;
    })
})

/*Socket chat*/

let input = document.getElementById('message');
let user = document.getElementById('user');
input.addEventListener('keyup',(e)=>{
    if(e.key === "Enter"){
        socket.emit ('message',{user:user.value, message:e.target.value});
    }
})
socket.on('messagelog', data=>{
    let p = document.getElementById('log');
    let messagesAll = data.map(message=>{
        return `<div><span>${message.user} dice: ${message.message}</span></div>`
    }).join('');
    p.innerHTML=messagesAll;
})


/*Formulario de registro*/

document.addEventListener('submit',enviarFormulario);
function enviarFormulario(event){
    event.preventDefault();
    let form = document.getElementById('productForm');
    let data = new FormData(form);
    fetch('/api/productos',{
        method: 'POST',
        body:data
    }).then(result=>{
        return result.json();
    }),then(json =>{
        Swal.fire({
            title:'Éxito',
            text:json.message,
            icon: 'success',
            timer: 2000,
        }).then(result=>{
            location.href='/'
        })
    }) 
}

document.getElementById("image").onchange = (e)=>{
    let read= new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "¡Gran Pokemon!"
        document.getElementById("preview").src = e.target.result;
    }
    read.readAsDataURL(e.target.files[0])
}
