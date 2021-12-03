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
    Toolbar,
    MenuItem
} from '@material-ui/core';
import { KeyboardDatePicker,MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Close,Delete } from '@material-ui/icons';
import React, { forwardRef, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { findTransaction, getAllTransaction } from '../store/TransactionServices';
import TransactionItems from './TransactionItems';
import Loader from '../../shared/components/Loader';
import moment from 'moment';

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
    const [filter,setFilter] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [search,setSearch] = useState('');
    const [paymentType,setPaymentType] = useState('none');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    const handlePaymentType = (e)=>{
        setPaymentType(e.target.value);
    }

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
        setSelectedDate(moment(date).format('YYYY-MM-DD'));
        let selDate = moment(date).format('YYYY-MM-DD');

        const selTrans = transactions.filter(transaction=>moment(transaction.transaction_date).format("YYYY-MM-DD") == selDate);
        
        setFilter(selTrans);
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
                            flexBasis : "190px",
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
                    <TextField
                        select
                        size="small"
                        variant="outlined"
                        label="Payment Type"
                        value={paymentType}
                        onChange={handlePaymentType}
                        style={{
                            flexBasis : "190px",
                            marginRight : "10px"
                        }}
                    >
                        <MenuItem key={0} value="none">None</MenuItem>
                        <MenuItem key={1} value="full">Full</MenuItem>
                        <MenuItem key={2} value="partial">Partial</MenuItem>
                    </TextField>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="dialog"
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
                    <IconButton
                        size="small"
                        onClick={()=>{
                            setFilter([]);
                            setPaymentType("none");
                        }}
                    >
                        <Delete color="primary" />
                    </IconButton>
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
                            minHeight : "550px",
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
                                {(paymentType != 'none' ? (filter.length > 0 ? filter : transactions).filter(transaction=>transaction.payment_type == paymentType) : (filter.length > 0 ? filter : transactions) ).slice(page * rowsPerPage,page * rowsPerPage + rowsPerPage).map(entry=>(
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
