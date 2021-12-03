import React,{useEffect,useRef,useCallback} from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Index';
import ProductsList from './products/components/ProductsList';
import { Grid, withStyles } from '@material-ui/core';
import useStyles from './Styles';
import Toast from './shared/components/Toast';
import { useDispatch } from 'react-redux';
import { CloseNotification } from './shared/store/NotificationSlice';
import Transaction from './cart/components/Transaction';
import Header from './shared/components/Header';
import TransactionList from './transactions/components/TransactionList';
import SuccessPage from './cart/components/SuccessPage';
import Settings from './settings/components/settings';
import TransactionDeleteModal from './transactions/components/TransactionDeleteModal';
import AddQty from './cart/components/AddQty';
import { useSelector } from 'react-redux';
import { cartItems } from './cart/store/CartSlice';
import { useHistory } from 'react-router-dom';
import { OpenNotification } from './shared/store/NotificationSlice';

function App(props) {

  const dispatch = useDispatch();
  const { root,ContainerWrap } = props.classes;
  const history = useHistory();
  const cart = useSelector(cartItems);
  const searchRef = useRef(null);
  const moment = require('moment-timezone');
  
  moment.tz.setDefault("Asia/Manila");

  const handleEvents = useCallback((e)=>{
        if( e.ctrlKey && e.code == 'KeyF' ){
            focusSearch();
        }

        if( e.ctrlKey && e.code == 'Enter'){
            if( cart.length <= 0 ){
                dispatch( OpenNotification({
                    message : "Cart is Empty.",
                    severity : "error"
                }) );
            }else{
                history.push('/transaction',cart);
            }            
        }
  },[cart]);

  const focusSearch = ()=>{
      searchRef.current.focus();
  }

  useEffect(()=>{

      document.addEventListener('keypress',handleEvents);

      return ()=>{
        document.removeEventListener('keypress',handleEvents);
      }      

  },[handleEvents]);

  const handleClose = ()=>{
      dispatch( CloseNotification() );
  }

  return (
    <Grid style={{ WebkitAppRegion : 'drag' }} container dicrection="column" className={root} spacing={3}>
        <Header searchRef={searchRef} />
        <Grid item lg={12} sm={12} className={ContainerWrap}>
            <Switch>
                <Route exact path="/">
                    <Dashboard />
                </Route>
                <Route exact path="/products" >
                    <ProductsList />
                </Route>
                <Route exact path="/add-qty" >
                    <AddQty />
                </Route>
                <Route exact path="/transaction">
                    <Transaction />
                </Route>
                <Route exact path="/transaction/success">
                    <SuccessPage />
                </Route>
                <Route exact path="/translist">
                    <TransactionList />
                </Route>
                <Route exact path="/transaction/delete/:id">
                    <TransactionDeleteModal />
                </Route>
                <Route exact path="/settings" >
                    <Settings />
                </Route>
            </Switch>
            <Toast
                handleCloseToast={handleClose}
            />
        </Grid>
    </Grid>
  );
}

export default withStyles(useStyles)(App);