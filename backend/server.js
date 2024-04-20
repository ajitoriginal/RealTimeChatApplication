const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const mongoose = require('mongoose')
const { MongoClient } = require('mongodb')
const connectDB = require('./startup/db')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, { cors: { origin: "*" } })
const PORT = process.env.PORT || 5000

// Connect to mongodb
connectDB()

app.get('/example', (req, res) => {
  res.send('Hello from server!')
})

const Message = mongoose.model('Message', { text: String, username: String, timestamp: { type: Date, default: Date.now } });

// WebSocket logic
io.on('connection', async (socket) => {
  console.log(`User connected : ${socket.id}`)

  // Send previous messages to new user
  let messages = await Message.find()
  socket.emit('init', { username: '', messages })

  // Handle user join
  socket.on('join', (username) => {
    socket.username = username
    io.emit('userJoined', username)
  })

  // Receive and broadcast new messages
  socket.on('message', async (data) => {
    const message = new Message({ text: data.text, username: data.username })
    await message.save()
    io.emit('message', { text: data.text, username: data.username, timestamp: message.timestamp })
  })

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
