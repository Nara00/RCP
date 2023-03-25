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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function convertirSegundosAMinutos(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${minutos < 10 ? "0" : ""}${minutos}:${segundosRestantes < 10 ? "0" : ""
    }${segundosRestantes}`;
}


const App = () => {
  //captación de datos
  const [time, setTime] = useState('fetching')
  const [presion, setPresion] = useState('fetching')
  const [distancia, setDistancia] = useState('fetching')
  const [frecuencia, setFrecuencia] = useState('fetching')
  const [simulationStatus, setSimulationStatus] = useState(0)
  const [openOk, setOpenOk] = useState(false);
  const [openNoOk, setOpenNoOk] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('connect', () => console.log(socket.id))
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 50) // 5000
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
      setEstadoPresion(0)
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
      setEstadoDistancia(0)
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


  const [contador, setContador] = useState(0);
  const [estaCorriendo, setEstaCorriendo] = useState(false);

  useEffect(() => {
    let intervalo;
    if (estaCorriendo) {
      intervalo = setInterval(() => {
        setContador((contador) => contador + 1);
      }, 10); //1000
    }

    if (contador >= 300) {
      finalizarSimulacion();
      setOpenOk(true);
    }

    return () => clearInterval(intervalo);
  }, [contador, estaCorriendo]);

  const empezarSimulacion = () => {
    setEstaCorriendo(true);
    setSimulationStatus(1);
    setContador(0);
  };

  const finalizarSimulacion = () => {
    setEstaCorriendo(false);
    setSimulationStatus(0);
    setContador(0);
  };

  const tiempoRestante = 300 - contador;

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
      }}>
        <Grid container style={{ marginTop: "7rem", width: "70%", justifyContent: "center" }}>
          <Grid item>
            <p style={{ fontSize: "2.5rem", marginBottom: "5rem", fontWeight: 600 }}>
              Simulador Médico UCC
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
            <Grid item style={{
              display: estaCorriendo ? "flex" : "hidden"
            }}>
              <p style={{
                fontSize: "2rem",
                margin: "0 1rem",
                fontWeight: 600,
                display: estaCorriendo ? "flex" : "hidden"
              }}>{convertirSegundosAMinutos(tiempoRestante)}</p>
            </Grid>
            <Grid item>
              <IconButton id='pause-circle-button' disabled={simulationStatus === 0} onClick={finalizarSimulacion}
                style={{
                  backgroundColor: !estaCorriendo ? "var(--disabled-grey)" : "var(--botones)",
                  color: "#FFFFFF",
                  margin: "0 0.3rem"
                }}>
                <Pause />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton disabled={simulationStatus === 1} onClick={empezarSimulacion}
                style={{
                  backgroundColor: estaCorriendo ? "var(--disabled-grey)" : "var(--botones)",
                  color: "#FFFFFF",
                  margin: "0 0.3rem"

                }}>
                <PlayArrow />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={openOk}
          onClose={() => setOpenOk(false)}
        >
          <DialogTitle>
            {"La simulación ha finalizado exitosamente"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Diganme que mensaje de felicitación quieren poner xd.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenOk(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openNoOk}
          onClose={() => setOpenNoOk(false)}
        >
          <DialogTitle>
            {"La simulación ha fallado"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Diganme que mensaje quieren poner xd.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNoOk(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default App;