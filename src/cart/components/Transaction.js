import { faDollarSign, faMoneyBill, faMoneyBillAlt, faPrint, faSave, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop, Fade, Grid, Modal, withStyles, TextField, InputAdornment, ButtonGroup, Button, Typography, MenuItem } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router';
import useStyle from './Styles';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { CreateTransaction } from '../store/CartServices';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { cartLoading } from '../store/CartSlice';
import Loader from '../../shared/components/Loader';
import { CreateTransactionReport } from '../../shared/store/ReportServices';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import TransactionDocDef from '../docs/TransactionDocDef';

function Transaction(props) {

    const dispatch = useDispatch();
    const loading = useSelector(cartLoading);
    const {state : cart} = useLocation();
    
    const [open,setOpen] = useState(false);
    const history = useHistory();
    const {TransactionModal,ModalContent} = props.classes;
    const [total,setTotal] = useState(0);
    const [info,setInfo] = useState({
        customer_name : '',
        transact_payment_type : 'full',
        cash_amount : 0,
        transact_status : true
    });

    const handleClose = async (id)=>{
        
        if( id.payload !== undefined ){
            const { transact_id } = id.payload;
            
            const resTrans = await dispatch( CreateTransactionReport({
                url : '/transactions/' + transact_id
            }) );
    
            if( CreateTransactionReport.fulfilled.match(resTrans) ){
                const { doc,logo } = resTrans.payload;
                let pdf = JSON.parse(doc);      

                if( pdf.length > 0 ){                    
                    pdfMake.vfs = pdfFonts.pdfMake.vfs;
                    const docDef = TransactionDocDef(pdf,logo);
                    const docGenerator = pdfMake.createPdf(docDef);

                    docGenerator.getBlob(blob=>{
                        let url = window.URL.createObjectURL(blob);                                                
                        history.push('/transaction/success?pdf=' + url);
                    });                    
                }else{
                    dispatch( OpenNotification({
                        message : 'No Transaction has been made.',
                        severity : 'error'
                    }) );
                }   
            }else{
                dispatch( OpenNotification({
                    message : 'Transaction Failed, Pls try again.',
                    severity : 'error'
                }) );
            }
        }else{            
            await history.goBack();
        }      
        setOpen(false);      
    }

    useEffect(()=>{
        setOpen(true);
        cart.map(item=>{
            let price = item.total_per_unit;
            setTotal( prevVal => prevVal + price)
        })
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
                    borderRadius : '20px',
                    height : '730px'
                }
            }}
            className={TransactionModal}
        >
            <Fade
                in={open}
            >
                <div className={ModalContent}>
                    <Grid container spacing={2}>                        
                        <Grid item lg={12} sm={12}>
                            <Typography variant="h6">
                                Total Number of Order :&nbsp;
                                <NumberFormat
                                    displayType="text" 
                                    value={cart.length}
                                    customInput={TextField}
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    label="Total"
                                    InputProps={{
                                        startAdornment : (
                                            <InputAdornment position="start">
                                                <FontAwesomeIcon icon={faDollarSign} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <Typography variant="h6">
                                Total Price :&nbsp;
                                <NumberFormat
                                    displayType="text" 
                                    value={total}
                                    customInput={TextField}
                                    fixedDecimalScale
                                    decimalScale={2}
                                    thousandSeparator
                                    decimalSeparator="."
                                    prefix="Php "
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    label="Total"
                                    InputProps={{
                                        startAdornment : (
                                            <InputAdornment position="start">
                                                <FontAwesomeIcon icon={faDollarSign} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <Typography variant="h6">
                                Cash Change :&nbsp;                                
                                <NumberFormat
                                    displayType="text" 
                                    value={info.cash_amount == 0 ? 0.00 : info.cash_amount - total}
                                    customInput={TextField}
                                    fixedDecimalScale
                                    decimalScale={2}
                                    thousandSeparator
                                    decimalSeparator="."
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    label="Total"
                                    InputProps={{
                                        startAdornment : (
                                            <InputAdornment position="start">
                                                <FontAwesomeIcon icon={faDollarSign} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Typography>
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={info.customer_name}
                                onChange={(e)=>{
                                    setInfo(info=>{
                                        return {
                                            ...info,
                                            customer_name : e.target.value
                                        }
                                    });
                                }}
                                label="Customer Name"
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <NumberFormat 
                                error={(info.transact_payment_type == 'full' && info.cash_amount < total ? true : false) || (
                                    info.cash_amount == 0 && info.transact_payment_type == 'partial'
                                )}
                                label="Cash Amount"
                                fullWidth
                                variant="outlined"
                                customInput={TextField}
                                value={info.cash_amount}
                                decimalScale={2}
                                decimalSeparator="."
                                fixedDecimalScale
                                InputProps={{
                                    startAdornment : (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faMoneyBill} />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(e)=>{
                                    let cash = e.target.value;
                                    setInfo(info=>{
                                        return {
                                            ...info,
                                            cash_amount : cash
                                        }
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                select
                                label="Payment Type"
                                value={info.transaction_payment_type}
                                onChange={(e)=>{
                                    let payment_type = e.target.value;
                                    setInfo(info=>{
                                        return {
                                            ...info,
                                            transact_payment_type : payment_type 
                                        }
                                    });
                                }}
                            >
                                <MenuItem value="full">Full Payment</MenuItem>
                                <MenuItem value="partial">Partial Payment</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid 
                            item 
                            lg={12} 
                            sm={12} 
                            style={{ 
                                position : 'absolute', 
                                bottom : '0',
                                left : '0'
                            }}
                        >
                            <ButtonGroup
                                variant="outlined" 
                                color="primary" 
                                aria-label="contained primary button group"
                            >
                                <Button 
                                    fullWidth 
                                    startIcon={<FontAwesomeIcon color="green" icon={faMoneyBillAlt} />}
                                    onClick={ async()=>{                                        
                                        
                                        if( info.customer_name == '' ) return;
                                        if( info.cash_amount === 0 ) return; 
                                        if(info.transact_payment_type == 'full' && info.cash_amount < total) return;

                                        const resTrans = await dispatch( CreateTransaction({
                                            values : cart.map(item=>{
                                                return {
                                                    ...item,                                                    
                                                    customer_name : info.customer_name,
                                                    total_amount : total,
                                                    cash_amount : info.cash_amount,
                                                    change_amount : info.cash_amount - total,
                                                    transact_payment_type : info.transact_payment_type === '' ? (info.cash_amount >= total ? 'full' : 'partial') : info.transact_payment_type,
                                                    transact_status : info.transact_payment_type === 'full' ? true : false
                                                }
                                            })
                                        }) );

                                        if( CreateTransaction.fulfilled.match(resTrans) ){
                                            handleClose(resTrans);
                                        }else if( CreateTransaction.rejected.match(resTrans) ){
                                            dispatch( OpenNotification({
                                                message : 'Error : ' + resTrans.payload,
                                                severity : 'error'
                                            }) );
                                            handleClose();
                                        }
                                    }}
                                >
                                    Process Order
                                </Button>
                                <Button
                                    onClick={handleClose}
                                >Cancel</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}

export default withStyles(useStyle)(Transaction)
