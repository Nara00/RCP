import { useState, useEffect } from 'react'
// import Grid from '@mui/material/Grid';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const Card = () => {

    return (
        <div>
            <Paper
                sx={{
                    // paddingTop: 1,
                    // paddingBottom: 1,
                    p: 3,
                    margin: 1.5,
                    maxWidth: 500,
                    flexGrow: 1,
                    backgroundColor: '#fff',
                }}
            >
                <Grid container spacing={2} style={{ justifyContent: "center" }}>
                    <Grid item>
                        <div style={{ backgroundColor: '#00FF00' }}>

                        </div>
                    </Grid>
                    <Grid item xs={12} sm container spacing={2}>
                        <Grid item>
                            <div style={{
                                backgroundColor: '#00FF00',
                                width: '3rem',
                                height: '100%',
                        }}>
                            </div>
                        </Grid>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    Standard license
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Full resolution 1920x1080 • JPEG
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default Card