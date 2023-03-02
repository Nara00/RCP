import React from 'react'
import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'

const App = () => {
  const [time, setTime] = useState('fetching')
  const [simulationStatus, setSimulationStatus] = useState(0)

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('connect', () => console.log(socket.id))
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000)
    })
    //  socket.on('time', (data)=>setTime(data))
    socket.on('lectura', (data) => setTime(data))
    socket.on('disconnect', () => setTime('server disconnected'))
  }, [])

  useEffect(() => {
    async function fetchData(action) {
      try {
        const response = await fetch(
          "http://localhost:5000/" + action
        );
      } catch (error) {
        console.log("error");
      }
      simulationStatus === 1 ? fetchData("start") : fetchData("stop");
    }
  }, [simulationStatus]);

  return (
    <div className="App">
      {time}
    </div>
  )
}
export default App;