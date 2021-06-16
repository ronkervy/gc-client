import { TableCell, TableRow } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import React, { useState } from 'react'
import TransactionSingle from './TransactionSingle';

function TransactionItems({transaction}) {

    const [open,setOpen] = useState(false);

    const handleOpen = ()=>{
        setOpen(true);
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    return (
        <TableRow
            key={transaction._id}
            hover
            onDoubleClick={handleOpen}
            style={{ 
                background : transaction.payment_type == 'partial' ? '#fafafa' : '',
                cursor : 'pointer',
                userSelect : 'none'
            }}
        >
            <TableCell>{transaction.customer_name}</TableCell>
            <TableCell
                style={{
                    textAlign : "center"
                }}
            >{transaction.cart_count}</TableCell>
            <TableCell
                style={{
                    textAlign : "center"
                }}
            >{transaction.transaction_date.split('T')[0]}</TableCell>
            <TableCell
                style={{
                    textAlign : "center"
                }}
            >{transaction.payment_type}</TableCell>
            <TableCell
                style={{
                    textAlign : "center"
                }}
            >
                <NumberFormat 
                    displayType="text"
                    value={transaction.cash_amount}
                    fixedDecimalScale
                    decimalScale={2}
                    thousandSeparator
                    prefix="Php "
                />
            </TableCell>
            <TableCell
                style={{
                    textAlign : "center"
                }}
            >
                <NumberFormat 
                    displayType="text"
                    value={transaction.total_price}
                    fixedDecimalScale
                    decimalScale={2}
                    thousandSeparator
                    prefix="Php "
                />
            </TableCell>
            <TableCell
                style={{
                    textAlign : "center"
                }}
            >
                <NumberFormat 
                    displayType="text"
                    value={transaction.change_amount}
                    allowNegative={false}
                    fixedDecimalScale
                    decimalScale={2}
                    thousandSeparator
                    prefix="Php "
                />
            </TableCell>
            <TransactionSingle data={transaction} inOpen={open} onClose={handleClose} />
        </TableRow>
    )
}

export default TransactionItems
