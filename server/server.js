import express from "express";
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors";
import jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = 'hello'

const port = 3000 

const app = express()


const server = createServer(app)

const io = new Server(server,{
    cors:{
        origin: ["http://localhost:5173", "http://localhost:3000"],
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

app.get("/login", (req, res)=>{
  const token =  jwt.sign({_id:"sfsfsfsf"}, secretKeyJWT)
  res.cookie('token', token, {httpOnly: true, secure:true, sameSite: "none"}).json({
    message:'login success'
  })
})

io.use((socket, next)=>{
cookieParser()(socket.request, socket.request.res,(err)=>{
    if (err) return next(err)
    const token = socket.request.cookies.token
    if(!token) return next (new Error ("Authentication Error"))
    const decoded = jwt.verify(token, secretKeyJWT)
    try {
        const decoded = jwt.verify(token, secretKeyJWT);
        if (!decoded) return next(new Error("Authentication Error"));
        // You can perform additional checks here if needed
        next();
    } catch (error) {
        return next(error);
    }
})
    
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