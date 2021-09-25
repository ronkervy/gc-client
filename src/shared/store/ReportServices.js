import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GetSettings } from '../../settings/store/SettingsServices';

const ReportServices = axios.create({
    timeout : 1000
});

const sleep = (x)=>{
    return new Promise((resolve)=>setTimeout(resolve,x))
}

export const CreateTransactionReport = createAsyncThunk(
    'report/CreateTransactionReport',
    async(args,{rejectWithValue,dispatch})=>{
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const { url } = args;
                const res = await ReportServices({
                    baseURL : `http://${host}:${port}/api/v1/gc-print`,
                    url,
                    method : 'GET'
                });
                await sleep(1000);
                return await res.data;            
            }            
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);