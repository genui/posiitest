import { Button, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { AddAPhoto } from '@material-ui/icons';
import React, { Component }  from 'react';
import PostTimeline from './PostTimeline';


const useStyles = makeStyles((theme) => ({
    title: {
        textAlign:'center',
        background: 'linear-gradient(transparent 50%, #f88522 50%)'
    }
}))

export default function Timeline() {
    const classes = useStyles()
    return(
        <div>
            <h1 className={classes.title}>TIME LINE</h1>
            <PostTimeline />
        </div>
    )
}