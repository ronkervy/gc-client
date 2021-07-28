import { faBoxes, faCalendar, faIdCard, faMarker, faMoneyBillWaveAlt, faPrint, faStop, faTrash, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop, Button, ButtonGroup, Fade, Grid, IconButton, InputAdornment, makeStyles, Modal, TextField } from '@material-ui/core'
import { Close } from '@material-ui/icons';
import React, { useState,useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loader from '../../shared/components/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { deleteTransaction, getDocDef, updateTransaction } from '../store/TransactionServices';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import TransactionDocDef from '../../cart/docs/TransactionDocDef';
import {CreateTransactionReport} from '../../shared/store/ReportServices';

const useStyles = makeStyles((theme)=>({
    Modal : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ModalContent : {
        width : "450px",
        height : "auto",
        borderRadius : "5px",
        background : "#ffffff",
        outline : 'none',
        padding : "25px"   
    }
}));

const BtnGroupSingleTrans = (props)=>{

    const { data,fn } = props;
    const dispatch = useDispatch();
    const { loading } = useSelector(state=>state.report);
    const [payment,setPayment] = useState({
        partial_payments : 0
    });
    const history = useHistory();

    if( loading ){
        return(
            <Loader />
        )
    }

    return(
        <Grid item container lg={12} sm={12} spacing={2}>
            {data.payment_type === 'partial' ? (
                <Grid item lg={6} sm={6}>
                    <NumberFormat
                        customInput={TextField}
                        fixedDecimalScale
                        decimalScale={2}
                        thousandSeparator
                        size="small"
                        fullWidth
                        label="Amount"
                        margin="dense"                                        
                        variant="outlined"
                        onChange={(e)=>{                        
                            setPayment(payment=>{
                                return {
                                    ...payment,
                                    partial_payments : parseInt(e.target.value)
                                }
                            })
                        }}
                        InputProps={{
                            style : {
                                color : data.payment_type == 'partial' ? "maroon" : "green"
                            }, 
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faMoneyBillWaveAlt} />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
            ) : (
                <div></div>
            )}
            <Grid 
                item 
                lg={6} 
                sm={6}
                style={{
                    display : "flex",
                    justifyContent : "center",
                    alignItems : "center"
                }}
            >
                <ButtonGroup variant="contained">
                    {data.payment_type === 'partial' ? (
                        <Button    
                            size="small"                                                                                    
                            color="secondary"
                            style={{
                                background : "green"
                            }}
                            onClick={async()=>{
                                const res = await dispatch( updateTransaction({
                                    opt : {
                                        url : '/transactions/' + data._id
                                    },
                                    value : payment
                                }) );

                                if( updateTransaction.fulfilled.match(res) ){
                                    dispatch( OpenNotification({
                                        message : 'Transaction Updated',
                                        severity : 'success'
                                    }) );
                                }else{
                                    dispatch( OpenNotification({
                                        message : 'Transaction Update Failed',
                                        severity : 'error'
                                    }) );
                                }
                            }}
                            startIcon={<FontAwesomeIcon icon={<Close />} />}
                        >
                            Pay
                        </Button>
                    ) : (
                        <Button size="small" disabled >Paid</Button>
                    )}
                    <Button 
                        size="small"                                                                                       
                        color="primary"
                        onClick={async ()=>{
                            
                            const resTrans = await dispatch( CreateTransactionReport({
                                url : '/transactions/' + data._id
                            }) );

                            if( CreateTransactionReport.fulfilled.match(resTrans) ){
                                const { doc,logo } = resTrans.payload;
                                let pdf = JSON.parse(doc);      
                                
                                console.log("PDF : ",pdf);

                                if( pdf.length > 0 ){
                                    pdfMake.vfs = pdfFonts.pdfMake.vfs;
                                    const docDef = TransactionDocDef(pdf,logo);
                                    const docGenerator = pdfMake.createPdf(docDef);

                                    docGenerator.getBlob(blob=>{
                                        console.log(blob);
                                        const url = window.URL.createObjectURL(blob);                        
                                        history.push('/transaction/success?pdf=' + url);
                                    });
                                }
                            }else{
                                dispatch( OpenNotification({
                                    message : 'Cannot Print Transaction, please try again.',
                                    severity : 'error'
                                }) );
                            }
                        }}
                        startIcon={<FontAwesomeIcon icon={faPrint} />}
                    >
                        Print
                    </Button>
                    <Button   
                        size="small"                                                                                     
                        color="secondary"
                        onClick={fn}
                        startIcon={<FontAwesomeIcon icon={<Close />} />}
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}

function TransactionSingle(props) {

    const { inOpen,onClose,data : transaction } = props;
    
    const { loading } = useSelector(state=>state.transactions);
    const classes = useStyles();

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <Modal
            open={inOpen}
            onClose={onClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
            className={classes.Modal}
        >
            <Fade
                in={inOpen}
            >
                <div className={classes.ModalContent}>
                    <Grid container spacing={2}>
                        <Grid item lg={12} sm={12}>
                            <TextField 
                                size="small"
                                fullWidth
                                disabled
                                label="Transaction ID"
                                value={transaction._id}
                                variant="outlined"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faIdCard} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <TextField 
                                size="small"
                                fullWidth
                                disabled
                                label="Customer"
                                value={transaction.customer_name}
                                variant="outlined"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={4} sm={4}>
                            <TextField 
                                size="small"
                                fullWidth
                                label="Item in cart"
                                value={transaction.cart_count}
                                variant="outlined"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faBoxes} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={8} sm={8}>
                            <TextField 
                                size="small"
                                disabled={ transaction.payment_type === 'full' ? true : false }
                                fullWidth
                                label="Transaction Date"
                                value={new Date(transaction.transaction_date).toISOString().split('T')[0]}
                                variant="outlined"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={5} sm={5}>
                            <TextField 
                                size="small"                                
                                fullWidth
                                label="Payment Type"
                                value={transaction.payment_type}
                                variant="outlined"
                                InputProps={{
                                    style : {
                                        color : transaction.payment_type == 'partial' ? "maroon" : "green"
                                    }, 
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMoneyBillWaveAlt} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={7} sm={7}>
                            <NumberFormat
                                customInput={TextField}
                                fixedDecimalScale
                                disabled={ transaction.payment_type === 'full' ? true : false }
                                decimalScale={2}
                                thousandSeparator
                                allowNegative={false}
                                prefix="Php " 
                                size="small"
                                fullWidth
                                label={transaction.payment_type == 'partial' ? "Remaining Balance" : "Change Amount"}
                                value={transaction.change_amount}
                                variant="outlined"
                                InputProps={{
                                    style : {
                                        color : transaction.payment_type == 'partial' ? "maroon" : "green"
                                    }, 
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMoneyBillWaveAlt} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <BtnGroupSingleTrans fn={onClose} data={transaction} />
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}

export default TransactionSingle
