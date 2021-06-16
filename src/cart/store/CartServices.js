import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const host = process.env.REACT_APP_HOST ? process.env.REACT_APP_HOST : 'localhost';

const CartService = axios.create({
    baseURL : `http://${host}:8081/api/v1`,
    timeout : 1000
});

const sleep = (x)=>{
    return new Promise(resolve=>setTimeout(resolve,x));
}

export const CreateTransaction = createAsyncThunk(
    'cart/CreateTransaction',
    async(args,{rejectWithValue})=>{        
        try{
            const { values } = args;
            const res = await CartService({
                url : '/transactions',
                method : 'POST',
                data : values
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);