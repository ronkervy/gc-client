import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetSettings } from '../../settings/store/SettingsServices';


const CartService = axios.create({
    timeout : 1000
});

const sleep = (x)=>{
    return new Promise(resolve=>setTimeout(resolve,x));
}

export const CreateTransaction = createAsyncThunk(
    'cart/CreateTransaction',
    async(args,{rejectWithValue,dispatch})=>{        
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;

                const { values } = args;
                const res = await CartService({
                    baseURL : `http://${host}:${port}/api/v1`,
                    url : '/transactions',
                    method : 'POST',
                    data : values
                });
                await sleep(2000);
                return res.data;             
            }             
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);