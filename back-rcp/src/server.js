const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const { SerialPort } = require('serialport')
const bodyParser = require('body-parser')
const port = new SerialPort({ path: 'COM4', baudRate: 9600 })

// SerialPort.list().then(ports => {
//   ports.forEach(function(port) {
//     console.log(port.path)
//   })
// })


const PORT = process.env.PORT || 5000
const app = express()
app.use(bodyParser.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

const server = http.createServer(app)

app.get('/stop', async (req, res) => {
  port.write('0')
  console.log('detenido')
  return res.json({
    estado: "parado"
  });
});

app.get('/start', async (req, res) => {
  port.write('1')
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
  
  socket.join('serial-data')
  
  socket.on('disconnect',(reason)=>{
    console.log(reason)
  })
})

port.on('readable', function () {
  // console.log(port.read().toString('utf-8'))
  let lectura = port.read().toString('utf-8')
  console.log(lectura)
  lectura_arr = lectura.split(',')
  lectura_arr = lectura_arr.slice(0, 3);
  lectura_arr[2] = lectura_arr[2].slice(0, -1);
  console.log(lectura_arr)
  // io.to('serial-data').emit('lectura', port.read())
  io.to('serial-data').emit('presion', lectura_arr[0])
  io.to('serial-data').emit('frecuencia', lectura_arr[1])
  io.to('serial-data').emit('distancia', lectura_arr[2])

})


server.listen(PORT, err=> {
  if(err) console.log(err)
  console.log('Server running on Port ', PORT)
})