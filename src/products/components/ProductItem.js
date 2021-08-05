import { faBox, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TableCell, TableRow, Tooltip } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../cart/store/CartSlice';

function ProductItem({item}) {

    const dispatch = useDispatch();

    return (
        <>
            <TableRow 
                hover key={item._id} 
                style={{ cursor : "pointer" }}
            >
                <TableCell style={{
                    fontSize : "10px"
                }}><FontAwesomeIcon color="grey" icon={faBox} />&nbsp;&nbsp;{item.item_name}</TableCell>
                <TableCell style={{
                    fontSize : "10px"
                }}>{item.item_qty}</TableCell>
                <TableCell style={{
                    fontSize : "10px"
                }}>{item.item_price}</TableCell>
                <TableCell>
                    <IconButton
                        color="primary"
                        onClick={()=>{
                            dispatch( addItem(item) );
                        }}
                        style={{
                            WebkitAppRegion : 'no-drag'
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
