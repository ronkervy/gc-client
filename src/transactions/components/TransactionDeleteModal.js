import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal,Fade,Backdrop, Grid,withStyles, Button } from '@material-ui/core';
import React,{ useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { loadingSelector } from '../../products/store/productSlice';
import Loader from '../../shared/components/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { deleteTransaction } from '../store/TransactionServices';
import Styles from './Styles';

function TransactionDeleteModal(props) {
    
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const { id } = useParams();
    const { classes } = props;
    const dispatch = useDispatch();
    const {loading} = useSelector(state=>state.transactions);

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
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
                timeout : 500,
                style : {
                    WebkitAppRegion : "no-drag",
                    height : "700px",
                    borderRadius : "15px"
                }
            }}
            className={classes.Modal}
        >
            <Fade
                in={open}
            >
                <Grid container className={classes.ModalContent} spacing={2}>
                    <Grid item lg={12} sm={12}>
                        <h4
                            style={{
                                textAlign : "center"
                            }}
                        >Delete transaction entry?</h4>                        
                    </Grid>
                    <Grid item lg={6} sm={6}>
                        <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            color="secondary"
                            startIcon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={ async()=>{
                                const resTrans = await dispatch( deleteTransaction({
                                    opt : {
                                        url : "/transactions/" + id
                                    }
                                }) );

                                if( deleteTransaction.fulfilled.match(resTrans) ){
                                    dispatch( OpenNotification({
                                        message : "Transaction has been deleted.",
                                        severity : "success"
                                    }) );
                                    handleClose();
                                }else{
                                    dispatch(OpenNotification({
                                        message : "Error deleting transaction.",
                                        severity : "error"
                                    }));
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </Grid>
                    <Grid item lg={6} sm={6}>
                        <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(TransactionDeleteModal)
