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
    socket.on('message', ({room, message})=>{
    console.log({"message":message, "room":room})

    //socket.broadcast.emit 'message' bata ako data feri sab lai .emit le send to frontend
    // socket.broadcast.emit('receive-message', {room, message})  //io.emit garda sabai lai including self lai janxa 
    
    io.to(room).emit("receive-message", message)
    })

    //above room mean sending particular person joinroom mean group chat
    socket.on('join-room', (room)=>{
        socket.join(room)
        console.log(`${socket.id} user join ${room}`)
    })

    socket.on('disconnect',()=>{
    console.log('user Disconnected', socket.id)
    })
})

server.listen(port, ()=>{

    console.log(`server is running on port ${port}`)
})