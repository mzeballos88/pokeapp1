import express from 'express';
import Contenedor from '../classes/Contenedor.js';
import upload from '../services/uploader.js';
import { io } from '../server.js';

const contenedor = new Contenedor();
const router = express.Router();

router.get('/',(req,res)=>{
    contenedor.getAll()
    .then(
        result=>{
        if(result.status ==="success"){
           res.status(200).send(result.event);
        }else{
           res.status(500).send(result.message);
        }
    })
})                         

router.get('/:id',(req,res)=>{
    let id = req.params.id;
    id = parseInt(id);
    contenedor.getById(id)
    .then(
        result=>{
            res.send(result);
            console.log(result);
        })
})

router.post('/',upload.single('image'),(req,res)=>{
    let file = req.file;
    let cuerpo = req.body;
    prod.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/resources/images/'+file.filename;
    contenedor.save(cuerpo)
    .then(
        result=>{
            res.send(cuerpo.id)
            if(result.status ==="success"){
                contenedor.getAll()
                .then(
                    result=>{
                        io.emit=('deliverProducts',result)
                    })
            }else{
               res.status(500).send("El pokemon ya existe");
            }
    })
})

router.put('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    let body = req.body;
    contenedor.updateProducto(id,body)
    .then(
        result=>{
        res.send(result);
    })
})


router.delete('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    contenedor.deleteById(id)
    .then(
        result=>{
            res.send(result);
        }
    )
})

export default router;