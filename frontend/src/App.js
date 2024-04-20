import React, { useState, useEffect, useRef } from 'react'
import socketIoClient from 'socket.io-client'
import './App.css'; // Import custom CSS for styling

const socket = socketIoClient('http://localhost:5000')

const App = () => {
  const [username, setUsername] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with previous messages
    socket.on('init', (data) => {
      setUsername(data.username)
      setMessages(data.messages)
    })

    // Update messages with new message
    socket.on('message', (data) => {
      setMessages([...messages, data])
    })

    // Handle user joined message
    socket.on('userJoined', (username) => {
      setMessages([...messages, { text: `${username} has joined the chat`, username: 'system' }])
    })

    // return () => {
    //   socket.disconnect()
    // }
  }, [messages])

  const handleUsernameSubmit = (e) => {
    e.preventDefault()
    setUsername(newMessage)
    socket.emit('join', newMessage)
    setNewMessage('')
  }

  const handleMessageSubmit = (e) => {
    e.preventDefault()
    const timestamp = new Date().toISOString()
    socket.emit('message', { text: newMessage, username, timestamp })
    setNewMessage('')
  }

  return (
    <div className="app">
      {!username ? (
        <div className="username-form">
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your username"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h1>Live Chat App{username && <span> - {username}</span>}</h1>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.username === username ? 'sent' : (msg.username === 'system' ? 'centered' : 'received')}`}>
              <div className="message-content">
                <div className="message-username"><b>{msg.username !== 'system' && (msg.username !== username ? msg.username : 'You')}</b></div>
                <div className="message-text">{msg.text}</div>
              </div>
              {msg.username !== 'system' && (
                <div className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              )}
            </div>
            ))}
            <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
          </div>
          <form onSubmit={handleMessageSubmit} className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
