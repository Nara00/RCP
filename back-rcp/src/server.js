const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const { SerialPort } = require('serialport')
const port = new SerialPort({ path: '/dev/tty-usbserial1', baudRate: 57600 })

const PORT = process.env.PORT || 5000
const app = express()
app.use(bodyParser.json());

const server = http.createServer(app)

app.post('/stop', async (req, res) => {
  port.write(1)
  return res.json({
    estado: "parado"
  });
});

app.post('/start', async (req, res) => {
  port.write(0)
  return res.json({
    estado: "iniciado"
  });
});


const io = socketIo(server, { 
    cors: {
      origin: 'http://localhost:3000'
    }
})

io.on('connection',(socket)=>{
  console.log('client connected: ',socket.id)
  
  // socket.join('clock-room')
  socket.join('serial-data')
  
  socket.on('disconnect',(reason)=>{
    console.log(reason)
  })
})

port.on('readable', function () {
  // console.log('Data:', port.read())
  io.to('serial-data').emit('lectura', port.read())
})


// setInterval(()=>{
//      io.to('clock-room').emit('time', new Date())
// },1000)





server.listen(PORT, err=> {
  if(err) console.log(err)
  console.log('Server running on Port ', PORT)
})