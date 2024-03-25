import express from "express";
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors";

const port = 3000 

const app = express()


const server = createServer(app)

const io = new Server(server,{
    cors:{
        origin:"*",
        methods: ["GET", "POST"],
        credentials: true,
    }
})

app.use(cors(
    {
        origin:"http://localhost:5173/",
        methods: ["GET", "POST"],
        credentials: true,
    }
))

app.get("/", (req, res)=>{
    res.send("hello socket")
})


//io whole circuit lai message trigger hunexa
io.on("connection",(socket)=>{
    console.log('user connected ID: ', socket.id)

    socket.emit("welcome",`welcome to server, ${socket.id}`)

    //aru join vako dehkne but afno welcome matra
    socket.broadcast.emit("welcome",`${socket.id}, joined the server`)

    //socket.on //'message' ma frontend bata ako data 
    socket.on('message', (data)=>{
    console.log(data)

    //socket.broadcast.emit //'message' bata ako data feri sab lai .emit le send to frontend
    socket.broadcast.emit('receive-message', data)  //io.emit garda sabai lai including self lai janxa 
    })

    socket.on('disconnect',()=>{
    console.log('user Disconnected', socket.id)
    })
})

server.listen(port, ()=>{

    console.log(`server is running on port ${port}`)
})