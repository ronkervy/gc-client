import { faCog, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal,Backdrop,withStyles, Fade, Grid, TextField, InputAdornment, Button } from '@material-ui/core';
import { Dns, UsbRounded } from '@material-ui/icons';
import React,{useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../shared/components/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { SetIPAddress } from '../store/SettingsServices';
import Styles from './Styles';

function Settings(props) {

    const { ipcRenderer } = window.require('electron');
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();
    const { loading } = useSelector(state=>state.settings);
    const { settings } = useSelector(state=>state.settings.entities);
    const [ipAdd,setIpAdd] = useState(settings.address);
    const [port,setPort] = useState(settings.port);
    const history = useHistory();
    const { classes } = props;

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    const handleRestart = ()=>{
        ipcRenderer.invoke('restart');
    }

    const handlePortChange = (e)=>{
        setPort(e.target.value);
    }

    useEffect(()=>{
        setOpen(true);
    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                style : {
                    height : "700px",
                    borderRadius : "15px"
                }
            }}
            className={classes.SettingsModal}
        >
            <Fade
                in={open}                        
            >
                <div className={classes.SettingsContent}>
                    <Grid container spacing={2}>
                        <Grid item lg={8} sm={8}>
                            <TextField
                                value={ipAdd}
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                label="Host Address"
                                placeholder="0.0.0.0"
                                onChange={(e)=>{
                                    setIpAdd(e.target.value)
                                }}
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <Dns />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={4} sm={4}>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                label="Port"       
                                value={port}
                                onChange={handlePortChange}       
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <UsbRounded />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6}>
                            <Button
                                color="primary"
                                fullWidth
                                variant="contained"
                                size="medium"
                                startIcon={<FontAwesomeIcon icon={faCog} />}
                                onClick={ async(e)=>{
                                    
                                    const resSettings = await dispatch(SetIPAddress({
                                        url : "/settings",
                                        data : {
                                            address : ipAdd,
                                            port : parseInt(port)
                                        }
                                    }));
                                    
                                    if( SetIPAddress.fulfilled.match(resSettings) ){
                                        dispatch( OpenNotification({
                                            message : "Settings has been saved.",
                                            severity : "success"
                                        }) );
                                        history.push('/');
                                        handleRestart();
                                    }else{
                                        dispatch( OpenNotification({
                                            message : "Please run application as `Administrator`\nSettings not save.",
                                            severity : "error"
                                        }) );
                                    }

                                }}
                            >Save</Button>
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(Settings)
