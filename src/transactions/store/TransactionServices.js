import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GetSettings } from '../../settings/store/SettingsServices';

const TransServices = axios.create({
    timeout : 62 * 2 * 1000
});

const sleep = (x)=>{
    return new Promise(resolve=>setTimeout(resolve,x));
}

export const getAllTransaction = createAsyncThunk(
    'transactions/getAllTransaction',
    async(args,{ rejectWithValue,dispatch })=>{
        const { opt } = args;
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'GET'
                });
                await sleep(2000);
                return res.data;            
            }            
        }catch(err){
            return rejectWithValue(err);
        }
    }
);

export const getSingleTransaction = createAsyncThunk(
    'transactions/getSingleTransaction',
    async(args, {rejectWithValue,dispatch})=>{
        const { opt } = args;
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'GET'
                });
                await sleep(2000);
                return res.data;            
            }            
        }catch(err){
            return rejectWithValue(err);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async(args,{ rejectWithValue,dispatch })=>{
        const { opt,values } = args;
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'POST',
                    data : values
                });
                await sleep(2000);
                return res.data;            
            }            
        }catch(err){
            return rejectWithValue(err);
        }
    }
);

export const findTransaction = createAsyncThunk(
    'transactions/findTransaction',
    async( args, { rejectWithValue,dispatch } )=>{        
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const { opt } = args;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'GET'
                });
                await sleep(2000);
                return res.data;            
            }            
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const getDocDef = createAsyncThunk(
    'transactions/getDocDef',
    async(args,{rejectWithValue,dispatch})=>{
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const { opt } = args;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'GET',
                    responseType : 'blob',  
                    headers: {
                        Accept: 'application/pdf',
                        'Content-Type': 'application/pdf',
                        mode : 'no-cors'
                    }
                });
                const url = window.URL.createObjectURL(res.data);
                return url;
            }            
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async(args,{rejectWithValue,dispatch})=>{
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const { opt,value } = args;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'PATCH',
                    data : value
                });
                await sleep(2000);
                return res.data;            
            }            
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async(args,{rejectWithValue,dispatch})=>{
        try{
            
            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const { opt } = args;
                const res = await TransServices({
                    ...opt,
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'DELETE'
                });
                await sleep(2000);
                return res.data;
            }
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);