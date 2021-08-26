import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const host = "http://localhost:8082/api";
const SettingsServices = axios.create({
    baseURL : host,
    timeout : 1000 * 2 * 62
});

const sleep = (x)=>{
    return new Promise((resolve)=>setTimeout(resolve,x));
}

export const SetIPAddress = createAsyncThunk(
    'settings/SetIPAddress',
    async(args,{rejectWithValue})=>{        
        try{
            const { url,data } = args;
            const res = await SettingsServices({
                url,
                method : "PATCH",
                data
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return(rejectWithValue(err.response.data));
        }
    }
); 

export const GetSettings = createAsyncThunk(
    'settings/GetSettings',
    async(args,{rejectWithValue})=>{        
        try{
            const { url } = args;
            const res = await SettingsServices({
                url,
                method : "GET"
            });
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);