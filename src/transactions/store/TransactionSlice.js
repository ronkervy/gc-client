import { createSlice } from '@reduxjs/toolkit';
import { createTransaction, deleteTransaction, findTransaction, getAllTransaction,getDocDef,updateTransaction } from './TransactionServices';

const transactionSlice = createSlice({
    name : 'transactions',
    initialState : {
        entities : [],
        pdf : [],
        loading : false,
        errors : null
    },
    reducers : {},
    extraReducers : (builder)=>{
        //FETCH ALL TRANSACTIONS
        builder.addCase(getAllTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(getAllTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(getAllTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //FIND TRANSACTION
        .addCase(findTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(findTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(findTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //GET DOCUMENT DEFINITION FOR PRINT
        .addCase(getDocDef.pending,state=>{
            state.loading = true;
        })
        .addCase(getDocDef.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.pdf = payload;
        })
        .addCase(getDocDef.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //CREATE TRANSACTION
        .addCase(createTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(createTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities[payload._id] = payload;
        })
        .addCase(createTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //UPDATE TRANSACTION
        .addCase(updateTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(updateTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(updateTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
        //DELETE TRANSACTION
        .addCase(deleteTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase(deleteTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(deleteTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.errors = payload;
        })
    }
});

export default transactionSlice.reducer;