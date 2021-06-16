import { AppBar, Container, Dialog, Grid, IconButton, Paper, Slide, Toolbar } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React, { useEffect, useState,forwardRef } from 'react'
import { useHistory } from 'react-router';

const Transition = forwardRef((props,ref)=>{
    return(
        <Slide 
            direction="up"
            ref={ref}
            {...props}
        />
    )
});

function PrintTransaction(props) {

    const [open,setOpen] = useState(false);
    const history = useHistory();

    useEffect(()=>{
        setOpen(true);
    },[]);

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            fullScreen
        >
            <AppBar
                style={{
                    WebkitAppRegion : "no-drag",
                    backgroundColor : "white"
                }}
            >
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="secondary"
                        onClick={handleClose}
                    >
                        <Close />
                    </IconButton>
                </Toolbar>                
            </AppBar>
            <Container maxWidth="lg sm">
                <Grid container>
                    TEST
                </Grid>
            </Container>
        </Dialog>
    )
}

export default PrintTransaction
