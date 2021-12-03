import { Box, Button, Divider, Grid, IconButton, InputAdornment, Paper, TextField, Typography, withStyles } from '@material-ui/core'
import { Close, Minimize, SettingsRemote } from '@material-ui/icons'
import React, { useEffect,useState } from 'react'
import useStyles from './Styles';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faList, faSearch, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setConnection } from '../store/ConnectionSlice';
import { searchProduct, selectAllProducts } from '../../products/store/productServices';
import { useHistory } from 'react-router';
import { GetSettings } from '../../settings/store/SettingsServices';
import { OpenNotification } from '../store/NotificationSlice';
import Loader from './Loader';
import { productsSelector } from '../../products/store/productSlice';
import { Autocomplete } from '@material-ui/lab';
import escapeStringRegexp from 'escape-string-regexp';

function Header(props) {

    const { ipcRenderer } = window.require('electron');
    const { searchRef } = props;
    const { HeaderWrap } = props.classes;


    const dispatch = useDispatch();
    const { isConnected : connection } = useSelector(state=>state.connection);
    const products = useSelector(productsSelector.selectAll);
    const { loading } = useSelector(state=>state.settings);
    const history = useHistory();
    const [searchText,setSearchText] = useState('');
    
    const closeWindow = ()=>{
        ipcRenderer.invoke('close');
    }

    const productsAutoComplete = ()=>{
        return [...new Set(products.map(product=>product.item_name !== undefined && product.item_name))];
    }

    const handleChange = (e)=>{
        setSearchText(e.target.value);
    }

    const handleKeyPress = async (e)=>{
        const filteredString = escapeStringRegexp(searchText);
        if( e.key === 'Enter' ){
            const res = await dispatch( searchProduct({
                opt : {
                    url : '/search/products?query=' + filteredString
                }
            }) );

            if( searchProduct.fulfilled.match(res) ){
                setSearchText('');
            }
        }
    }
  
    const minimizeWindow = ()=>{
        ipcRenderer.invoke('min');
    }

    const defaultSettings = async()=>{
        try{
            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }));

            if( GetSettings.fulfilled.match(resSettings) ){
                const { settings } = resSettings.payload;                

                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const socket = io(`http://${host}:${port}`);

                socket.on('connect',()=>{
                    dispatch( setConnection(socket.connected) );
                });

                socket.on('disconnect',()=>{                    
                    dispatch( setConnection(socket.connected) );             
                });

                socket.on('server-printer',(printerName)=>{
                    console.log(printerName);
                });

                socket.on('created_product',()=>{
                    dispatch( selectAllProducts({
                        opt : {
                            url : '/products'
                        }
                    }));
                });

                socket.on('updated_product',()=>{
                    dispatch( selectAllProducts({
                        opt : {
                            url : '/products'
                        }
                    }));
                });

                socket.on('deleted_product',()=>{
                    dispatch( selectAllProducts({
                        opt : {
                            url : '/products'
                        }
                    }));
                });

                socket.on("print-status",message=>{
                    console.log(message);
                });
            }

        }catch(err){
            dispatch( OpenNotification({
                message : "Settings not loaded.",
                severity : "error"
            }) );
        }
    }

    useEffect(()=>{

        defaultSettings();

    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

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
                justifyContent : "space-between",
                WebkitAppRegion : "no-drag"
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
                <Autocomplete                     
                    style={{ width : "350px" }}
                    disablePortal
                    clearOnBlur={true}
                    options={productsAutoComplete()}
                    onChange={(e,value)=>setSearchText(value)}
                    size="small"
                    PaperComponent={({children})=>(
                        <Paper style={{ WebkitAppRegion : "no-drag", marginTop : "40px" }}>{children}</Paper>
                    )}                        
                    renderInput={(params)=>(
                        <TextField 
                            fullWidth      
                            variant="outlined" 
                            label="Search Product"
                            value={searchText}
                            style={{
                                WebkitRegionApp : "no-drag"
                            }}
                            InputProps={{
                                ...params.inputProps,
                                startAdornment : (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            {...params}
                        />
                    )}
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
                        variant="contained"
                        color="primary"
                        startIcon={<FontAwesomeIcon icon={faList} />}
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
                    <SettingsRemote fontSize="small" htmlColor={ connection ? "green" : "maroon" } />
                    <Typography variant="caption">&nbsp;{ connection ? `Connected to Server` : "Disconnected" }</Typography>
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
                    onClick={()=>{
                        history.push('/settings');
                    }}
                >
                    <FontAwesomeIcon icon={faCog} />
                </IconButton>
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
