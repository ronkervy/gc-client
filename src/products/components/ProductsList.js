import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../shared/components/Loader';
import { selectAllProducts } from '../store/productServices';
import { loadingSelector, productsSelector } from '../store/productSlice';
import ProductItem from './ProductItem';
import { io } from 'socket.io-client';


function ProductsList() {

    const dispatch = useDispatch();
    const products = useSelector(productsSelector.selectAll);
    const loading = useSelector(loadingSelector);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const { ipcRenderer } = window.require('electron');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const socketCon = ()=>{
        ipcRenderer.on('get-ip',(e,args)=>{
            const host = args.address ? args.address : 'localhost';
            const socket = io(`http://${host}:8081`);

            socket.on("connect",()=>{
                if( products.length == 0 ){
                    dispatch( selectAllProducts({
                        opt : {
                            url : '/products'
                        }
                    }) );
                }     
            });
        });
    }

    useEffect(()=>{

        socketCon();

        dispatch( selectAllProducts({
            opt : {
                url : '/products'
            }
        }) );

    },[]);

    if( loading ){
        return(
            <Loader />
        )
    }

    return (
        <div>
            <TableContainer component={Paper} style={{ minHeight : "600px", position : 'relative' }}>
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
                            left : '0'
                        }}
                    >
                        <TableCell colSpan={4}>
                            <TablePagination 
                                rowsPerPageOptions={[8, 16, 800]}
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
