import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container, Stack, TextField, Typography} from '@mui/material'


const App = () => {
  const socket = useMemo(()=> io ("http://localhost:3000/",{withCredentials:true}), [])

  const [message, setMessage]=useState('')
  const [room, setRoom]=useState('')
  const [socketID, setSocketID]=useState('')
  const [kura, setKura] = useState([''])
  const [roomName, setRoomName] = useState([''])


  const handelSubmit =(e)=>{
    //.emit sending message data to backend
    e.preventDefault()
    socket.emit('message', {message,room})
    setMessage('')
  }

  const joinRoomHandelSubmit=(e)=>{
    e.preventDefault()
    socket.emit('join-room',roomName)
    setRoomName("")
  }

  useEffect(()=>{
    //.on backend bata ako data listening gareko
    socket.on("connect",()=>{
      setSocketID(socket.id)
      console.log("connected", socket.id)
    })

    // socket.on("welcome",(s)=>{console.log(s)})

    socket.on('receive-message',(data)=>{
      console.log(data)
      setKura((kura)=>[...kura, data])  //chat collection
    })
    
    return () =>{
      socket.disconnect()
    }
  },[])


  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' component='div' gutterBottom>
        Welcome to Socket.io by sahil
      </Typography>

    <Typography variant='h6' component="div" gutterBottom>
      {socketID}
    </Typography>

    <form onSubmit={joinRoomHandelSubmit}>
      <h5>Join Room</h5>
      <TextField value={roomName} onChange={e=>setRoomName(e.target.value)}  id='outlined-basic' label='Room Name' variant='outlined' />
      <Button variant='contained' color='primary' type='submit' > Join room</Button>
    </form>

    <form onSubmit={handelSubmit}>
      <TextField value={message} onChange={e=>setMessage(e.target.value)}  id='outlined-basic' label='Message' variant='outlined' />
      <TextField value={room} onChange={e=>setRoom(e.target.value)}  id='outlined-basic' label='Room' variant='outlined' />
      <Button variant='contained' color='primary' type='submit' > Send</Button>
    </form>

      {/* //stack is like div with flex direction is col  */}
    <Stack>
      {
        kura.map((m,i)=>(
          <Typography key={i} variant='h6' component="div" gutterBottom>
            {m}
          </Typography>
        ))
      }
    </Stack>

    </Container>
  )
}

export default App