import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { GetSettings } from '../../settings/store/SettingsServices';


const ProdServices = axios.create({
    timeout : 1000 * 2 * 62
});

const sleep = (x)=>{
    return new Promise((resolve)=>setTimeout(resolve,x));
}

export const selectAllProducts = createAsyncThunk(
    'products/selectAllProducts',
    async( args ,{ rejectWithValue,dispatch })=>{        
        try{
            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const { opt } = args;
                const res = await ProdServices({
                    baseURL : `http://${host}:${port}/api/v1`,
                    ...opt,                
                    method : "GET"
                });
                await sleep(2000);
                return res.data;
            }
        }catch(err){    
            return rejectWithValue(err.response.data);
        }
    }
);

export const searchProduct = createAsyncThunk(
    'products/searchProduct',
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
                const res = await ProdServices({
                    baseURL : `http://${host}:${port}/api/v1`,
                    ...opt,                
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

export const selectSingleProduct = createAsyncThunk(
    'products/selectSingleProduct',
    async(id,{rejectWithValue,dispatch})=>{
        try{

            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";
                const port = settings.port !== undefined ? settings.port : 8081;
                const res = await ProdServices({
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'GET',
                    url : '/products/' + id
                });
                return res.data;  
            }         
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'products/createTransaction',
    async( values,{rejectWithValue,dispatch} )=>{
        try{
            
            const resSettings = await dispatch( GetSettings({
                url : "/settings"
            }) );

            if(GetSettings.fulfilled.match(resSettings)){
                const { settings } = resSettings.payload;
                const host = settings.address !== undefined ? settings.address : "localhost";      
                const port = settings.port !== undefined ? settings.port : 8081;        
                const res = await ProdServices({
                    baseURL : `http://${host}:${port}/api/v1`,
                    method : 'POST',
                    url : '/products',
                    data : values
                });
                return res.data; 
            }          
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);