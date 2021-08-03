import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const { ipcRenderer } = window.require('electron');
let ProdServices;

ipcRenderer.on('get-ip',(e,args)=>{
    const host = args.address ? args.address : 'localhost';
    
    ProdServices = axios.create({
        baseURL : `http://${host}:8081/api/v1`,
        timeout : 1000
    });

});

const sleep = (x)=>{
    return new Promise((resolve)=>setTimeout(resolve,x));
}

export const selectAllProducts = createAsyncThunk(
    'products/selectAllProducts',
    async( args ,{ rejectWithValue })=>{
        const { opt } = args;
        try{
            const res = await ProdServices({
                ...opt,
                method : "GET"
            });
            await sleep(2000);
            return res.data;
        }catch(err){    
            return rejectWithValue(err.response.data);
        }
    }
);

export const searchProduct = createAsyncThunk(
    'products/searchProduct',
    async(args,{rejectWithValue})=>{
        try{
            const { opt,value } = args;
            const res = await ProdServices({
                ...opt,
                method : 'GET'
            });
            await sleep(2000);
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const selectSingleProduct = createAsyncThunk(
    'products/selectSingleProduct',
    async(id,{rejectWithValue})=>{
        try{
            const res = await ProdServices({
                method : 'GET',
                url : '/products/' + id
            });
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);

export const createTransaction = createAsyncThunk(
    'products/createTransaction',
    async( values,{rejectWithValue} )=>{
        try{
            const res = await ProdServices({
                method : 'POST',
                url : '/products',
                data : values
            });
            return res.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);