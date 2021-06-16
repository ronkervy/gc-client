import React,{useEffect,useRef} from 'react';
import { BrowserRouter as Router,Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Index';
import ProductsList from './products/components/ProductsList';
import { io } from 'socket.io-client';
import { Grid, withStyles } from '@material-ui/core';
import useStyles from './Styles';
import Toast from './shared/components/Toast';
import { useDispatch } from 'react-redux';
import { CloseNotification } from './shared/store/NotificationSlice';
import PrintTransaction from './cart/components/PrintTransaction';
import Transaction from './cart/components/Transaction';
import Header from './shared/components/Header';
import TransactionList from './transactions/components/TransactionList';
import SuccessPage from './cart/components/SuccessPage';

function App(props) {

  const dispatch = useDispatch();
  const { root,ContainerWrap } = props.classes;
  const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';
  const socket = io(`http://${host}:8081`);
  const searchRef = useRef(null);

  const focusSearch = ()=>{
      searchRef.current.focus();
  }

  useEffect(()=>{
      console.log(host);

      socket.emit('client',{
          name : "client"
      });

      document.addEventListener('keydown',(e)=>{
          if( e.ctrlKey && e.key == 'f' ){
              focusSearch();
          }
      });

      return ()=>{
        document.removeEventListener('keydown',(e)=>{          
            if( e.ctrlKey && e.key == 'f' ){
                focusSearch();
            }
        });
      }

  },[]);

  const handleClose = ()=>{
      dispatch( CloseNotification() );
  }

  return (
    <Router>
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
                <Route exact path="/print" >
                    <PrintTransaction />
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
            </Switch>
            <Toast
                handleCloseToast={handleClose}
            />
        </Grid>
    </Grid>
    </Router>
  );
}

export default withStyles(useStyles)(App);