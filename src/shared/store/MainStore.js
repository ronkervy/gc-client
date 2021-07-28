import { configureStore } from '@reduxjs/toolkit';
import ProductReducers from '../../products/store/productSlice';
import CartReducer from '../../cart/store/CartSlice';
import NotificationReducer from './NotificationSlice';
import TransactionReducer from '../../transactions/store/TransactionSlice';
import ConnectionReducer from './ConnectionSlice';
import ReportReducer from './ReportSlice';

export default configureStore({
    reducer : {
        products : ProductReducers,
        cart : CartReducer,
        notifications : NotificationReducer,
        transactions : TransactionReducer,
        connection : ConnectionReducer,   
        report : ReportReducer     
    }
});