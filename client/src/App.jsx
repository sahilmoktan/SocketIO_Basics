import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container, TextField, Typography} from '@mui/material'


const App = () => {
  const socket = useMemo(()=> io ("http://localhost:3000/"), [])

  const [message, setMessage]=useState('')
  const [room, setRoom]=useState('')

  const handelSubmit =(e)=>{
    //.emit sending message data to backend
    e.preventDefault()
    socket.emit('message', {message,room})
    setRoom('')
  }

  useEffect(()=>{
    //.on backend bata ako data listening gareko
    socket.on("connect",()=>{
      console.log("connected", socket.id)
    })

    socket.on("welcome",(s)=>{console.log(s)})

    socket.on('receive-message',(data)=>{
      console.log(data)
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

    <Typography variant='h4' component="div" gutterBottom>
      {socket.id}
    </Typography>

    <form onSubmit={handelSubmit}>
      <TextField value={message} onChange={e=>setMessage(e.target.value)}  id='outlined-basic' label='Message' variant='outlined' />
      <TextField value={room} onChange={e=>setRoom(e.target.value)}  id='outlined-basic' label='Room' variant='outlined' />
      <Button variant='contained' color='primary' type='submit' > Send</Button>
    </form>

    </Container>
  )
}

export default App