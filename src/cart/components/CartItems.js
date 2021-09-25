import { faBoxes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeItem, updateQty,setDiscount } from '../store/CartSlice'
import NumberFormat from 'react-number-format';
import { motion } from 'framer-motion'

function CartItems({item}) {

    const dispatch = useDispatch();
    const [total,setTotal] = useState(parseInt(item.item_price) * parseInt(item.qty));
    const [totalSrp,setTotalSrp] = useState(parseInt(item.item_srp) * parseInt(item.qty));

    useEffect(()=>{
        setTotal(parseInt(item.item_price) * parseInt(item.qty));
        setTotalSrp(parseInt(item.item_srp) * parseInt(item.qty));
    },[item.qty]);

    useEffect(()=>{
        setTotal(item.total_per_unit);
        setTotalSrp(item.total_per_unit_srp);
    },[item.total_per_unit,item.total_per_unit_srp]);

    return (
        <>
            <TableRow 
                key={item._id}   
                component={motion.tr}              
                initial={{
                    y : -100,
                    opacity : 0
                }}
                animate={{
                    y : 0,
                    opacity : 1
                }}
            >
                <TableCell
                    style={{fontSize : '10px'}}
                ><FontAwesomeIcon color="grey" icon={faBoxes} />&nbsp;&nbsp;{item.item_name.substring(0,18) + '...'}</TableCell>
                <TableCell>
                    <TextField 
                        error={ item.error }
                        variant="outlined"
                        size="small"
                        value={item.qty}
                        onChange={(e)=>{
                            let val = e.target.value == '' ? 0 : parseInt(e.target.value);                            
                            dispatch( updateQty({
                                ...item,
                                qty : val
                            }));
                        }}    
                        inputProps={{
                            style : {
                                textAlign : 'center',
                                fontSize : '10px'
                            }
                        }}
                        style={{
                            WebkitAppRegion : 'no-drag'
                        }}
                    />
                </TableCell>
                <TableCell>
                    <NumberFormat
                        thousandSeparator 
                        displayType="text"
                        value={totalSrp}
                        style={{ fontSize : '10px' }}
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        fixedDecimalScale={true}                    
                    />
                </TableCell>
                <TableCell>
                    <TextField 
                        disabled={item.error}
                        variant="outlined"
                        size="small" 
                        margin="none"
                        value={item.discount * 100}      
                        inputProps={{
                            style : {
                                textAlign : 'center',
                                fontSize : '10px',
                                width : '50px'
                            }
                        }}    
                        onChange={(e)=>{                               
                            dispatch( setDiscount({
                                ...item,
                                discount : e.target.value === '' ? 0 : parseInt(e.target.value)
                            }));
                        }}
                        style={{
                            WebkitAppRegion : 'no-drag'
                        }}
                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        color="secondary"
                        size="small"
                        onClick={()=>{
                            dispatch( removeItem(item._id) );
                        }}
                        style={{
                            WebkitAppRegion : 'no-drag'
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} /> 
                    </IconButton>
                </TableCell> 
            </TableRow>
        </>
    )
}

export default CartItems
