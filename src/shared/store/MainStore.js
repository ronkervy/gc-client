import { configureStore } from '@reduxjs/toolkit';
import ProductReducers from '../../products/store/productSlice';
import CartReducer from '../../cart/store/CartSlice';
import NotificationReducer from './NotificationSlice';
import TransactionReducer from '../../transactions/store/TransactionSlice';
import ConnectionReducer from './ConnectionSlice';
import ReportReducer from './ReportSlice';
import SettingsReducer from '../../settings/store/SettingsSlice';

export default configureStore({
    reducer : {
        settings : SettingsReducer,
        products : ProductReducers,
        cart : CartReducer,
        notifications : NotificationReducer,
        transactions : TransactionReducer,
        connection : ConnectionReducer,   
        report : ReportReducer     
    }
});