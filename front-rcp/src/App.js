import React from 'react'
import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Card from './Card';
import Box from '@mui/material/Box';
import { Button, IconButton } from '@mui/material';
// import { PauseCircle, PlayCircle, StopCircle } from '@mui/icons-material';
import { Pause, PlayArrow, Stop } from '@mui/icons-material';
import './App.css'

const App = () => {
  //captación de datos
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



  //estados: 0 = fetching, 1 = rojo, 2 = amarillo, 3 = verde
  const [estadoPresion, setEstadoPresion] = useState(0)
  const [estadoDistancia, setEstadoDistancia] = useState(0)
  const [estadoFrecuencia, setEstadoFrecuencia] = useState(0)

  useEffect(() => {
    if (presion == 0) {
      setEstadoPresion(1)
    }
    else if (presion == 1) {
      setEstadoPresion(3)
    }
    else {
      setEstadoPresion(1)
    }
  }, [presion])

  useEffect(() => {
    if (distancia == 0) {
      setEstadoDistancia(1)
    }
    else if (distancia == 1) {
      setEstadoDistancia(3)
    }
    else {
      setEstadoDistancia(2)
    }
  }, [distancia])

  useEffect(() => {
    if (frecuencia == 0) {
      setEstadoFrecuencia(1)
    }
    else if (frecuencia == 1) {
      setEstadoFrecuencia(3)
    }
    else {
      setEstadoFrecuencia(0)
    }
  }, [frecuencia])


  //timer

  const [timeRemaining, setTimeRemaining] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  function startSimulation() {
    setSimulationStatus(1);

    const endTime = Date.now() + 5 * 60 * 1000; // Tiempo en milisegundos de finalización de la simulación
    setIntervalId(setInterval(() => {
      const timeLeft = Math.round((endTime - Date.now()) / 1000);
      if (timeLeft <= 0) {
        setSimulationStatus(0);
        clearInterval(intervalId);
      } else {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      }
    }, 1000)) // Actualizar el tiempo restante cada segundo (1000 milisegundos)

    // Cancelar el conteo si se presiona el botón PauseCircle
    // const cancelCountdown = () => {
    //   setSimulationStatus(0);
    //   clearInterval(intervalId);
    //   setTimeRemaining(null);
    // };
    // const pauseCircleButton = document.querySelector('#pause-circle-button');
    // pauseCircleButton.addEventListener('click', cancelCountdown);
  }

  const cancelCountdown = () => {
    setSimulationStatus(0);
    clearInterval(intervalId);
    setTimeRemaining(null);
  };

  function endSimulation () {
    setSimulationStatus(0);
    setTimeRemaining(null);
    cancelCountdown()
  }



  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
      }}>
        <Grid container style={{ marginTop: "7rem", width: "70%", justifyContent: "center" }}>
          <Grid item>
            <p style={{ fontSize: "2.5rem", marginBottom: "5rem", fontWeight: 600 }}>
              EL TITULO QUE LE VAYAN A PONER
            </p>
          </Grid>
          <Grid container item xs={12} style={{ justifyContent: "space-between" }}>
            {/* <Card valor={"2.0"} tipo="presión" estado={estadoPresion} enabled={simulationStatus === 1} /> */}
            <Card valor={presion && presion != "fetching" ? presion : "--"} tipo="presión" estado={estadoPresion} enabled={simulationStatus === 1} />
            <Card valor={distancia && distancia != "fetching" ? distancia : "--"} tipo="distancia" estado={estadoDistancia} enabled={simulationStatus === 1} />
            <Card valor={frecuencia && frecuencia != "fetching" ? frecuencia : "--"} tipo="frecuencia" estado={estadoFrecuencia} enabled={simulationStatus === 1} />
          </Grid>
          <Grid container item xs={12} style={{
            justifyContent: "flex-end",
            alignItems: "center",
            margin: "2rem 0rem"
          }}>
            {/* {timeRemaining !== null && ( */}
              <Grid item style={{
                display: timeRemaining ? "flex" : "hidden"
              }}>
                <p style={{
                  fontSize: "2rem",
                  margin: "0 1rem",
                  fontWeight: 600
                }}>{timeRemaining}</p>
              </Grid>
            {/* )} */}
            <Grid item>
              <IconButton id='pause-circle-button' disabled={simulationStatus === 0} onClick={endSimulation}
                style={{
                  backgroundColor: !timeRemaining ? "var(--disabled-grey)" : "var(--botones)",
                  color: "#FFFFFF",
                  margin: "0 0.3rem"
                }}>
                <Pause />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton disabled={simulationStatus === 1} onClick={startSimulation}
                style={{
                  backgroundColor: timeRemaining ? "var(--disabled-grey)" : "var(--botones)",
                  color: "#FFFFFF",
                  margin: "0 0.3rem"

                }}>
                <PlayArrow />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
export default App;