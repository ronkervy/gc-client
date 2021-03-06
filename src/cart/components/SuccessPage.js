import React,{ useEffect,useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Modal,Backdrop,Fade, Fab } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Loader from '../../shared/components/Loader';
import Styles from './Styles';
import { withStyles } from '@material-ui/styles';
import { Close } from '@material-ui/icons';

export const useQuery = ()=>{
    return new URLSearchParams(useLocation().search);
}

function SuccessPage(props) {

    const history = useHistory();
    const [open,setOpen] = useState(false);
    const { loading } = useSelector(state=>state.transactions);
    const { loading : rptLoad } = useSelector(state=>state.report);
    const query = useQuery();
    const pdf = query.get('pdf');
    const page = query.get('page');
    const { classes } = props;

    const handleClose = ()=>{
        
        if( page === 'transaction' ){
            history.goBack();
        }else{
            history.push('/');
        }

        setOpen(false);
    }

    useEffect(()=>{        
        setOpen(true);
    },[]);

    if( loading || rptLoad ){
        return(
            <Loader />
        )
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            closeAfterTransition
            BackdropProps={{
                timeout : 500,
                style : {
                    height : "700px",
                    borderRadius : "15px"
                }
            }}
        >
            <Fade
                in={open}
            >
                <div className={classes.SuccessPageModal}>
                    <Fab
                        size="small"
                        variant="circular"
                        onClick={handleClose}
                        style={{
                            position : "absolute",
                            left : 15,
                            top : 8,          
                            WebkitAppRegion : "no-drag"          
                        }}
                    >
                        <Close />
                    </Fab>
                    <iframe                         
                        style={{
                            border : "none",    
                            WebkitAppRegion : 'no-drag'                        
                        }} 
                        onClick={handleClose}                         
                        src={pdf+'#toolbar=1'} 
                        width="100%" 
                        height="100%"
                    ></iframe>
                </div>                
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(SuccessPage)
