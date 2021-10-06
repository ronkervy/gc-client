import { faBoxes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeItem, updateQty,setDiscount, cartItems } from '../store/CartSlice'
import NumberFormat from 'react-number-format';
import { motion } from 'framer-motion'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'

function CartItems({item}) {

    const dispatch = useDispatch();
    const [total,setTotal] = useState(parseInt(item.item_price) * parseInt(item.qty));
    const [totalSrp,setTotalSrp] = useState(parseInt(item.item_srp) * parseInt(item.qty));
    const cart = useSelector(cartItems);
    const history = useHistory();

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
                id={item._id}
                hover
                key={item._id}   
                component={motion.tr}     
                title={`Name : ${item.item_name}\nQuantity : ${item.qty}\nDiscount : ${item.discount * 100}%`}         
                initial={{
                    y : -100,
                    opacity : 0
                }}
                animate={{
                    y : 0,
                    opacity : 1
                }}
                onDoubleClick={()=>{
                    history.push(`/add-qty?mode=update&discount=${item.discount / 100}`,item);
                }}
                style={{ WebkitAppRegion : "no-drag",cursor : "pointer" }}
            >
                <TableCell
                    style={{fontSize : '10px'}}
                    colSpan={2}
                ><FontAwesomeIcon color="grey" icon={faBoxes} />&nbsp;&nbsp;{item.item_name.substring(0,30) + '...'}</TableCell>                                
                <TableCell style={{ textAlign : "center" }}>{item.qty}</TableCell>
                <TableCell>
                    <NumberFormat
                        thousandSeparator 
                        displayType="text"
                        value={totalSrp}
                        style={{ fontSize : '10px', textAlign : "center" }}
                        decimalScale={2} 
                        decimalSeparator={'.'}
                        fixedDecimalScale={true}                    
                    />
                </TableCell>                
                <TableCell style={{ textAlign : "center" }}>
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
