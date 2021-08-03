import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const { ipcRenderer } = window.require('electron');
let ReportServices;

ipcRenderer.on('get-ip',(e,args)=>{
    const host = args.address ? args.address : 'localhost';
    ReportServices = axios.create({
        baseURL : `http://${host}:8081/api/v1/gc-print`,
        timeout : 62 * 2 * 1000
    });
});

const sleep = (x)=>{
    return new Promise((resolve)=>setTimeout(resolve,x))
}

export const CreateTransactionReport = createAsyncThunk(
    'report/CreateTransactionReport',
    async(args,{rejectWithValue})=>{
        try{
            const { url } = args;
            const res = await ReportServices({
                url,
                method : 'GET'
            });
            await sleep(2000);
            return await res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);