import fs from 'fs';
import makeId from '../utils.js';
import __dirname from '../dirname.js';
const productURL = __dirname+'/files/producto.txt';

class Contenedor{
    async save(event){
        try {
            let data = await fs.promises.readFile(productURL,'utf-8')
            let events = JSON.parse(data);
            if(events.some(ev => ev.title === event.title)){
                return {status: "error", message: "El producto ya existe"}
            }else{
                let dataObj = {
                    id: makeId(4),
                    title: event.title,
                    price: event.price,
                    thumbnail: event.thumbnail,
            }
                let pokemonId = dataObj.id;

            events.push(dataObj);
                try{
                    await fs.promises.writeFile(productURL,JSON.stringify(events,null,2));
                    return{status:"success", message:pokemonId}
                }catch(err){
                    return{status:"error", message:"El producto no fue creado"}
                }
            }
        }catch{
            let dataObj = {
                id: makeId(4),
                title: event.title,
                price: event.price,
                thumbnail: event.thumbnail,
            }
            try {
                await fs.promises.writeFile(productURL,JSON.stringify([dataObj],null,2))
                return {status: "success", message: "Producto creado con éxito"}
            }catch(error){
                return {status: "error", message: "No se puede crear el producto" +error}
            }
        }
    }

    async getById(id){
        try{
            let data = await fs.promises.readFile(productURL,'utf-8')
            let events = JSON.parse(data);
            let event = events.find(evnt => evnt.id === id);
            console.log(event);
            if(event){
                return { status:"success", event:event}
            }
        }catch(err){
            return {status:"error", message:"No se encontró el producto"}

        }
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(productURL,'utf-8')
            let events = JSON.parse(data);
            let event = events
            return {status:"success", event:event}
        }catch(err){
            return {status:"error", message:"No se encontró la lista de productos"}
        }
    }

    async deleteById(id){
        try{
            let data = await fs.promises.readFile(productURL,'utf-8')
            let events = JSON.parse(data);
            let event = events.filter(evnt => evnt.id !== id);
            if(event){
                await fs.promises.writeFile(productURL,JSON.stringify(event,null,2))
                return {status: "success", message: "Producto borrado con éxito"}
                }
        }catch(err){
            return {status:"error", message:"No se encontró un producto con ese ID"} 
        }
    }

    async deleteAll(){
        try{
            await fs.promises.unlink(productURL,'utf-8')
            return {status: "success", message: "Los productos fueron eliminados con éxito"}
        }catch(error){
            return {status: "error", message: "No se pueden eliminar los productos"}
            }
    }

    async getRandom(){
        try{
            let data = await fs.promises.readFile(productURL,'utf-8')
            let events = JSON.parse(data);
            let event = events[Math.floor(Math.random()*events.lenght)];

            return {status:"success", event:event}
        }catch(err){
            return {status:"error", message:"Intentalo de nuevo"}
        }
    }

   async updateProducto(id,body){
        try{
            let data = await fs.promises.readFile(productURL,'utf-8');
            let productos = JSON.parse(data);
            if(!productos.some(prod=> prod.id === id))
            return{ status: "error", message:"No hay productos con ese Id"}
            let result = productos.map( prod=>{
                if(prod.id ===id){
                    body = Object.assign({id:prod.id,...body})
                    return body;
                }else{
                    return prod;
                }
            })
            try{
                await fs.promises.writeFile(productURL,JSON.stringify(result,null,2));
                return {status: "success", message:"Producto actualizado"}
                }catch{
                    return {status:"error", message:"Error al actualizar el usuario"}
                }
        }catch(err){
            return {status:"error", message:"Intentalo de nuevo"}
        }
    }
}

export default Contenedor;