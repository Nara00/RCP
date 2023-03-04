import React from 'react'
import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Card from './Card';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

const App = () => {
  const [time, setTime] = useState('fetching')
  const [presion, setPresion] = useState('fetching')
  const [distancia, setDistancia] = useState('fetching')
  const [frecuencia, setFrecuencia] = useState('fetching')
  const [simulationStatus, setSimulationStatus] = useState(0)

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('connect', () => console.log(socket.id))
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000)
    })
    //  socket.on('time', (data)=>setTime(data))
    socket.on('lectura', (data) => setTime(data))
    socket.on('presion', (data) => setPresion(data))
    socket.on('frecuencia', (data) => setFrecuencia(data))
    socket.on('distancia', (data) => setDistancia(data))
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
    }
    console.log("useeffect")
    simulationStatus === 1 ? fetchData("start") : fetchData("stop");
  }, [simulationStatus]);

  return (
    <>
      <p> Presion: {presion} </p>
      <p> Frecuencia: {frecuencia} </p>
      <p> Distancia: {distancia} </p>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: '100wh',
        height: '50vh'
      }}>
        <Grid container sx={(theme) => ({
          justifyContent: "center"
          // '& > div': {
          // justifyContent: "center",
          // }
        })}>

          <Grid item>
            <Card />
          </Grid>
          <Grid item>
            <Card />
          </Grid>
          <Grid item>
            <Card />
          </Grid>
        </Grid>

      </div>
      <div style={{ textAlign: '-webkit-center' }}>
        <Button variant="contained" onClick={() => setSimulationStatus(1)}>Iniciar</Button>
        <Button variant="contained" onClick={() => setSimulationStatus(0)}>Detener</Button>
      </div>
      
    </>
  )
}
export default App;