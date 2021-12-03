import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    Button, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow 
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Loader from '../../shared/components/Loader';
import { OpenNotification } from '../../shared/store/NotificationSlice';
import { cartItems } from '../store/CartSlice';
import CartItems from './CartItems';

function Cart(props) {

    const dispatch = useDispatch();
    const cart = useSelector(cartItems);
    const { loading } = useSelector(state=>state.cart);
    const [items,setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);
    const history = useHistory();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>{
        setItems(cart);
    },[cart]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <TableContainer
            component={Paper} 
            elevation={2} 
            style={{
                minHeight : "560px",
                position : 'relative',
                WebkitAppRegion : "no-drag"
            }}
        >
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={2}>Name</TableCell>    
                        <TableCell style={{ textAlign : "center" }}>QTY</TableCell>              
                        <TableCell>Total</TableCell>
                        <TableCell style={{ textAlign : "center" }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.slice(page*rowsPerPage,page*rowsPerPage + rowsPerPage).map(item=>( 
                        <CartItems 
                            item={item}
                        />
                    ))}                    
                </TableBody>
                <TableRow style={{
                    position : "absolute",
                    bottom : '0',
                    left : '0',
                    WebkitAppRegion : "no-drag"
                }}>      
                    <TableCell colSpan={1}>
                        <Button
                            variant="contained"
                            size="small"
                            style={{
                                backgroundColor : "green",
                                color : "#ffffff",
                                WebkitAppRegion : 'no-drag'
                            }}
                            startIcon={<FontAwesomeIcon icon={faShoppingBag} />}
                            onClick={()=>{

                                if( items.length == 0 ){
                                    return dispatch( OpenNotification({
                                        message : 'Cart is Empty',
                                        severity : 'error'
                                    }) );
                                }

                                let errors = [];

                                items.map(item=>{
                                    if( item.error === true ){
                                        errors.push(item.error);
                                    }
                                });

                                if( errors.length > 0 ){
                                    return dispatch( OpenNotification({
                                        message : 'Invalid Quantity',
                                        severity : 'error'
                                    }) );
                                };

                                history.push('/transaction',cart);
                            }}
                        >Checkout</Button>
                    </TableCell>              
                    <TableCell colSpan={4}>
                        <TablePagination
                            rowsPerPageOptions={[9]}
                            count={items.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            labelRowsPerPage={false}
                        />
                    </TableCell>          
                </TableRow>
            </Table>
        </TableContainer>
    )
}

export default Cart
