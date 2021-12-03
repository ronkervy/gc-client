import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../shared/components/Loader';
import { selectAllProducts } from '../store/productServices';
import { clearProducts, loadingSelector, productsSelector } from '../store/productSlice';
import ProductItem from './ProductItem';

function ProductsList() {

    const dispatch = useDispatch();
    const products = useSelector(productsSelector.selectAll);
    const { loading : settingsLoading } = useSelector(state=>state.settings);
    const { isConnected : connection } = useSelector(state=>state.connection);
    const loading = useSelector(loadingSelector);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(11);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(()=>{
        setPage(0);
    },[products]);

    useEffect(()=>{
        
        dispatch( selectAllProducts({
            opt : {
                url : '/products'
            }
        }) );

    },[]);

    if( loading || settingsLoading ){
        return(
            <Loader />
        )
    }

    return (
        <div>
            <TableContainer component={Paper} style={{ minHeight : "550px", position : 'relative', WebkitAppRegion : "no-drag" }}>
                <Table size="small" stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>QTY</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map(product=>(                            
                            <ProductItem item={product} />
                        ))}
                    </TableBody>
                    <TableRow
                        style={{
                            position : 'absolute',
                            bottom : '0',
                            left : '0',
                            WebkitAppRegion : 'no-drag'
                        }}
                    >
                        <TableCell colSpan={4}>
                            <TablePagination 
                                rowsPerPageOptions={[11]}
                                count={products.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ProductsList
