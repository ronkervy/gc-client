import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop, Fade, Grid, Modal,withStyles,TextField, Button, ButtonGroup } from '@material-ui/core';
import React,{useEffect,useState, useCallback,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { addItem, cartItems, setDiscount, updateQty } from '../store/CartSlice';
import Styles from './Styles';
import NumberFormat from 'react-number-format';

const useQuery = ()=>{
    return new URLSearchParams(useLocation().search);
}

function AddQty(props) {

    let valRef = useRef(0);
    const [qty,setQTY] = useState(1);
    const [open,setOpen] = useState(false);
    const [itemDiscount,setItemDiscount] = useState(0);
    const [err,setErr] = useState(false);

    const cart = useSelector(cartItems);
    const history = useHistory();
    const location = useLocation();
    const mode = useQuery().get('mode');
    const dispatch = useDispatch();
    const { AddQTYModal,ModalCartContent } = props.classes;
    

    const { state : item } = location;

    const cartQuantity = ()=>{
        const arrCurrentCart = cart.filter(itm=>itm.item_name===item.item_name);
        return arrCurrentCart[0] !== undefined ? parseInt(arrCurrentCart[0].qty) : [];
    }

    const errMessage = cartQuantity() >= item.item_qty || mode === "update" && parseInt(qty) > parseInt(item.inventory_qty) ? "Inventory is empty" : "Current quantity in inventory is : " + (mode === "update" ? item.inventory_qty : item.item_qty);

    const handleClose = ()=>{
        history.goBack();
        setOpen(false);
    }

    const handleDiscount = (e)=>{
        e.target.value === "" ? setItemDiscount(0) : setItemDiscount(e.target.value);        
    }

    const handleChange = (e)=>{
        setQTY(e.target.value);
    }

    const handleSave = ()=>{        

        let val = qty === "" ? 0 : parseInt(qty);           
        if(err) return;
        if( val > item.item_qty ) return;
        if( mode === "update" && val > parseInt(item.inventory_qty) ) return;        
        if( cartQuantity() >= item.item_qty ) return;

        if( mode === null ){

            dispatch(addItem({
                ...item,
                inventory_qty : item.item_qty,
                item_qty : val,
                discount : parseInt(itemDiscount)
            }));

        }else{
            if( item.discount !== parseInt(itemDiscount) ){
                dispatch( setDiscount({
                    ...item,
                    discount : parseInt(itemDiscount)
                }) );
            };

            if( item.qty !== qty ){
                dispatch( updateQty({
                    ...item,
                    qty : val
                }) );
            }
        }

        handleClose();
    }

    const handleSaveEvent = useCallback(e=>{
        let saveBtn = document.getElementById("saveBtn");
        if( e.key == "Enter" || e.code == "Enter" ){
            saveBtn.click();
        }
    },[]);

    useEffect(()=>{
        document.addEventListener('keypress',handleSaveEvent);

        return ()=>{
            document.removeEventListener('keypress',handleSaveEvent);
        }
    },[handleSaveEvent]);

    useEffect(()=>{
        if( (item.item_qty - (cartQuantity() + parseInt(qty))) < 0 ){
            setErr(true);
        }else{
            setErr(false);
        }
    },[item.item_qty,qty]);

    useEffect(()=>{
        
        if( mode === "update" ){
           setQTY(item.qty);
           setItemDiscount(item.discount * 100);
        }

        setOpen(true);
      
    },[]);

    return (
        <Modal            
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout : 500
            }}
            closeAfterTransition
            className={AddQTYModal}
        >
            <Fade
                in={open}
            >
                <Grid                     
                    container 
                    className={ModalCartContent} 
                    spacing={2}      
                    id="qty-modal"              
                >
                    <Grid item lg={12} sm={12}>
                    <NumberFormat
                        customInput={TextField} 
                        fullWidth
                        disabled={item.error}
                        variant="outlined"
                        label="Discount"   
                        ref={valRef}      
                        size="small" 
                        margin="none"
                        value={parseInt(itemDiscount)}      
                        inputProps={{
                            style : {
                                textAlign : "center"
                            }
                        }}    
                        onChange={handleDiscount}
                        style={{
                            WebkitAppRegion : 'no-drag'
                        }}
                    />
                    </Grid>
                    <Grid item lg={12} sm={12}>
                        <NumberFormat
                            customInput={TextField} 
                            autoFocus
                            error={ err || cartQuantity() >= item.item_qty || mode === "update" && qty > parseInt(item.inventory_qty) ? true : false}
                            helperText={errMessage}
                            fullWidth                            
                            label="Quantity" 
                            ref={valRef}                           
                            value={parseInt(qty)}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            inputProps={{
                                style : {
                                    textAlign : "center"
                                }
                            }}
                        />
                    </Grid>
                    <Grid item lg={12} sm={12}>
                        <ButtonGroup>
                            <Button
                                id="saveBtn"
                                variant="contained"
                                size="small"
                                fullWidth
                                startIcon={<FontAwesomeIcon icon={faSave} />}
                                color="primary"
                                onClick={(e)=>{
                                    e.preventDefault();
                                    handleSave(e);
                                }}
                            >
                                {mode === "update" ? "Update" : "Save"}
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                color="secondary"
                                onClick={()=>{
                                    
                                    handleClose();
                                }}
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
    )
}

export default withStyles(Styles)(AddQty)
