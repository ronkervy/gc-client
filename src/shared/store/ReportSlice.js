import { createSlice } from '@reduxjs/toolkit';
import { CreateTransactionReport } from './ReportServices';

const ReportSlice = createSlice({
    name : 'report',
    initialState : {
        doc : '',
        loading : true,
        error : ''
    },
    reducers : {},
    extraReducers : builder =>{
        builder.addCase( CreateTransactionReport.pending,state=>{
            state.loading = true;
        })
        .addCase( CreateTransactionReport.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.doc = payload;
        })
        .addCase(CreateTransactionReport.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export default ReportSlice.reducer;