import { faBox, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TableCell, TableRow, TextField, Tooltip } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../cart/store/CartSlice';
import NumberFormat from 'react-number-format';
import { useHistory } from 'react-router';
 
function ProductItem({item}) {

    const dispatch = useDispatch();
    const history = useHistory();

    return (
        <>
            <TableRow 
                hover
                key={item._id} 
                style={{ cursor : "pointer",WebkitAppRegion : 'no-drag' }}
                title={`Name : ${item.item_name}\nType : ${item.item_type}\nBrand : ${item.item_brand}`}
            >
                <TableCell style={{ fontSize : "11px" }}><FontAwesomeIcon color="grey" icon={faBox} />&nbsp;&nbsp;{item.item_name}</TableCell>
                <TableCell style={{ fontSize : "11px" }}>{item.item_qty}</TableCell>
                <TableCell style={{ fontSize : "11px" }}>
                    <NumberFormat 
                        displayType="text"
                        thousandSeparator
                        fixedDecimalScale
                        allowNegative={false}
                        decimalScale={2}
                        decimalSeparator="."                        
                        customInput={TextField}                        
                        value={item.item_srp}
                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={()=>{
                            // dispatch( addItem(item) );
                            history.push('/add-qty',item);
                        }}
                        style={{
                            WebkitAppRegion : 'no-drag',
                        }}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    )
}

export default ProductItem
