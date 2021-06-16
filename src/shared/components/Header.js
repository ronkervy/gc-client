import { Box, Button, Divider, Grid, IconButton, InputAdornment, Paper, TextField, Typography, withStyles } from '@material-ui/core'
import { Close, Minimize } from '@material-ui/icons'
import React, { useEffect,useState } from 'react'
import useStyles from './Styles';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faList, faSearch, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setConnection } from '../store/ConnectionSlice';
import { searchProduct, selectAllProducts } from '../../products/store/productServices';
import { useHistory } from 'react-router';

function Header(props) {

    const { ipcRenderer } = window.require('electron');
    const { searchRef } = props;
    const { HeaderWrap } = props.classes;
    const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';
    const socket = io(`http://${host}:8081`);
    const dispatch = useDispatch();
    const { isConnected : connection } = useSelector(state=>state.connection);
    const history = useHistory();
    
    const closeWindow = ()=>{
        ipcRenderer.invoke('close');
    }
  
    const minimizeWindow = ()=>{
        ipcRenderer.invoke('min');
    }

    useEffect(()=>{

        socket.on('connect',()=>{
            dispatch( setConnection(socket.connected) );
        });

        socket.on('disconnect',()=>{
            dispatch( setConnection(socket.connected) );
        });

    },[]);

    return (
        <Grid              
            item   
            container
            lg={12} sm={12}
            className={HeaderWrap}
            component={Paper}
            elevation={2}
            style={{
                display : "flex !important",
                flexDirection : 'row',
                justifyContent : "space-between"
            }}
        >
            <Box
                style={{
                    WebkitAppRegion : "no-drag",
                    height : "40px",
                    alignSelf : "center",
                    display : 'flex'
                }}
            >
                <TextField 
                    size="small"
                    margin="none"                    
                    variant="outlined" 
                    label="Search Product"
                    inputRef={searchRef}
                    InputProps={{
                        startAdornment : (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                            </InputAdornment>
                        )
                    }}
                    onKeyPress={(e)=>{
                        if( e.key === 'Enter' ){
                            dispatch( searchProduct({
                                opt : {
                                    url : '/products/search/' + e.target.value
                                }
                            }) );
                        }
                    }}
                />    
                <Divider style={{ margin : "0px 10px"}} variant="fullWidth" orientation="vertical" flexItem />                
                <Box
                    style={{
                        WebkitAppRegion : "no-drag",
                        height : "40px",
                        display : 'flex',
                        alignItems : 'center'
                    }}
                >
                    <IconButton                        
                        size="small"
                        onClick={()=>{
                            dispatch( selectAllProducts({
                                opt : {
                                    url : '/products'
                                }
                            }) );
                        }}
                    >                        
                        <FontAwesomeIcon color="blue" icon={faSyncAlt} />    
                    </IconButton>                    
                </Box>
                <Divider style={{ margin : "0px 10px"}} variant="fullWidth" orientation="vertical" flexItem />
                <Box
                    style={{
                        WebkitAppRegion : "no-drag",
                        height : "40px",
                        display : 'flex',
                        alignItems : 'center',
                        justifySelf : 'flex-end'
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<FontAwesomeIcon color="green" icon={faList} />}
                        size="small"
                        onClick={()=>{
                            history.push('/translist');
                        }}                        
                    >
                        Transactions
                    </Button>
                </Box>
                <Divider style={{ margin : "0px 10px"}} variant="fullWidth" orientation="vertical" flexItem />
                <Box
                    style={{
                        WebkitAppRegion : "no-drag",
                        height : "40px",
                        display : 'flex',
                        alignItems : 'center',
                        justifySelf : 'flex-end'
                    }}
                >
                    <FontAwesomeIcon icon={faCircle} color={
                        connection ? "green" : "red"
                    } />
                    <Typography variant="caption">&nbsp;{ connection ? "Connected to Server" : "Disconnected" }</Typography>
                </Box>
            </Box>
            <Box  
                style={{
                    WebkitAppRegion : "no-drag",
                    alignSelf : "center"
                }}
            >
                <IconButton
                    size="small"
                    component={motion.div}
                    whileHover={{scale : 1.1}}
                    onClick={minimizeWindow}
                >
                    <Minimize 
                        color="primary" 
                    />
                </IconButton>
                <IconButton                     
                    size="small"                     
                    component={motion.div}
                    whileHover={{scale : 1.1}}
                    onClick={closeWindow}
                >
                    <Close 
                        color="secondary" 
                    />
                </IconButton>&nbsp;&nbsp;
            </Box>
        </Grid>
    )
}

export default withStyles(useStyles)(Header)
