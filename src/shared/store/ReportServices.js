import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GetSettings } from '../../settings/store/SettingsServices';

const ReportServices = axios.create({
    timeout : 62 * 2 * 1000
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
                const host = settings.address !== undefined ? settings.address : undefined;
                const { url } = args;
                const res = await ReportServices({
                    baseURL : `http://${host}:8081/api/v1/gc-print`,
                    url,
                    method : 'GET'
                });
                await sleep(2000);
                return await res.data;            
            }            
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);