import React, { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container, TextField, Typography} from '@mui/material'


const App = () => {
  const socket = io ("http://localhost:3000/")

  const [message, setMessage]=useState('')

  const handelSubmit =(e)=>{
    e.preventDefault()
    socket.emit('message', message)
    setMessage('')
  }

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected", socket.id)
    })
    socket.on("welcome",(s)=>{console.log(s)})
    return () =>{
      socket.disconnect()
    }
  },[])


  return (
    <Container maxWidth='sm'>
      <Typography variant='h4' component='div' gutterBottom>
        Welcome to Socket.io by sahil
      </Typography>

    <form onSubmit={handelSubmit}>
      <TextField value={message} onChange={e=>setMessage(e.target.value)}  id='outlined-basic' label='Outlined' variant='outlined' />
      <Button variant='contained' color='primary' type='submit' > Send</Button>
    </form>

    </Container>
  )
}

export default App