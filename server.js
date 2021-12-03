import Contenedor from './classes/Contenedor.js';
import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import upload from './services/uploader.js';
import __dirname from './dirname.js';
import {Server} from 'socket.io';


const contenedor = new Contenedor();

const app = express();
import archivoRutas from './rutas/index.js';
const PORT = process.env.PORT||8080;

const server = app.listen(PORT, ()=>{
    console.log("Servidor escuchando en: " +PORT)
})

export const io = new Server(server);

app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})


app.use('/resources',express.static(__dirname+'/public'));
app.use('/api/productos', archivoRutas);

app.get('/views/productos', (req,res)=>{
    contenedor.getAll().then(result=>{
        let info = result.event;
        let preparedObject ={
            products : info
        }
        res.render('products', preparedObject)
    })
})


let messages =[];

io.on('connection', socket =>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let products = await contenedor.getAll();
    socket.emit('deliverProducts',products);
    
    socket.emit('messagelog',messages);
    socket.on('message', data=>{
        messages.push(data)
        io.emit('messagelog',messages);
    })
})
