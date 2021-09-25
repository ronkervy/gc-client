import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    AppBar, 
    Dialog, 
    Grid, 
    IconButton, 
    InputAdornment, 
    makeStyles, 
    Paper, 
    Slide, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow, 
    TextField, 
    Toolbar 
} from '@material-ui/core';
import { KeyboardDatePicker,MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Close } from '@material-ui/icons';
import React, { forwardRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { findTransaction, getAllTransaction } from '../store/TransactionServices';
import TransactionItems from './TransactionItems';
import Loader from '../../shared/components/Loader';

const useStyles = makeStyles((theme)=>({
    appBar : {
        position : 'relative',
        background : "#ffffff"
    }
}));

const TransitionDialog = forwardRef((props,ref)=>{
    return(
        <Slide 
            direction="up"
            ref={ref}
            {...props}            
        />
    )
});

function TransactionList(props) {

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { entities : transactions } = useSelector(state=>state.transactions);
    const { loading } = useSelector(state=>state.transactions);
    
    const [open,setOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [search,setSearch] = useState('');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClose = ()=>{
        setOpen(false);
        history.goBack();
    }

    useEffect(()=>{
        setOpen(true);
        dispatch( getAllTransaction({
            opt : {
                url : '/transactions'
            }
        }) );
    },[]);

    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()).toLocaleDateString());

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
        let selDate = new Date(date);
        dispatch( findTransaction({
            opt : {
                url : `/search/transactions?date=${selDate}`
            }
        }) )
    };

    if( loading ){
        return(
            <Loader />
        )
    }


    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={TransitionDialog}
            BackdropProps={{
                style : {
                    height : "700px",
                    borderRadius : "15px"
                }
            }}
            style={{
                WebkitAppRegion : "no-drag",
                padding : "20px",
                height : "660px",
                borderRadius : "10px"
            }}
        >   
            <AppBar className={classes.appBar}>
                <Toolbar 
                    style={{
                        justifyContent : 'space-between'
                    }}
                >
                    <TextField 
                        size="small"
                        variant="outlined"
                        label="Search"
                        InputProps={{
                            startAdornment : (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputAdornment>
                            )
                        }}
                        style={{
                            flexBasis : "220px",
                            flex : 2,
                            marginRight : "10px"
                        }}
                        onKeyDown={(e)=>{
                            setSearch(e.target.value);
                        }}
                        onKeyPress={(e)=>{
                            if( e.key === 'Enter' ){
                                dispatch( findTransaction({
                                    opt : {
                                        url : `/search/transactions?s=${search}`
                                    }
                                }) )
                            }
                        }}
                    />
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-dd-MM"
                        size="small"
                        margin="dense"
                        id="date-picker-inline"
                        label="Filter Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{
                            alignSelf : "flex-start",
                            flex : 1
                        }}
                    />
                    <IconButton focusRipple={false} style={{ margin : "0px 8px" }} size="small" onClick={handleClose}>
                        <Close color="secondary" />
                    </IconButton>                    
                </Toolbar>
            </AppBar>
            <Grid container>
                <Grid item lg={12} sm={12} style={{ padding : "30px" }}>
                    <TableContainer
                        component={Paper}
                        elevation={2}
                        style={{
                            minHeight : "500px",
                            position : "relative"
                        }}
                    >
                        <Table 
                            stickyHeader 
                            size="medium"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight : 600 }}>Customer Name</TableCell>
                                    <TableCell style={{ fontWeight : 600, textAlign : 'center' }}>In cart</TableCell>
                                    <TableCell style={{ fontWeight : 600, textAlign : 'center' }}>Transaction date</TableCell>
                                    <TableCell style={{ fontWeight : 600, textAlign : 'center' }}>Payment Type</TableCell>
                                    <TableCell style={{ fontWeight : 600, textAlign : 'center' }}>Cash Amount</TableCell>
                                    <TableCell style={{ fontWeight : 600, textAlign : 'center' }}>Total</TableCell>
                                    <TableCell style={{ fontWeight : 600, textAlign : 'center' }}>Change</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map(entry=>(
                                    <TransactionItems transaction={entry} />
                                ))}
                                <TableRow style={{ position : "absolute", bottom : 0, right : 0 }} >
                                    <TablePagination 
                                        rowsPerPageOptions={[8, 16, 800]}
                                        count={transactions.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        labelRowsPerPage={false}
                                    />
                                </TableRow>
                            </TableBody>                            
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>            
        </Dialog>
        </MuiPickersUtilsProvider>
    )
}

export default TransactionList
