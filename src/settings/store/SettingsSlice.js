import { createSlice } from '@reduxjs/toolkit';
import { GetSettings, SetIPAddress } from './SettingsServices';

const SettingsSlice = createSlice({
    name : 'settings',
    initialState : {
        entities : [],
        loading : true,
        error : ''
    },
    reducers : {},
    extraReducers : builder=>{
        //SET HOST IP ADDRESS
        builder.addCase( SetIPAddress.pending,state=>{
            state.loading = true;
        })
        .addCase(SetIPAddress.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(SetIPAddress.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //GET SETTINGS
        .addCase(GetSettings.pending,state=>{
            state.loading = true;
        })
        .addCase(GetSettings.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.entities = payload;
        })
        .addCase(GetSettings.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

export default SettingsSlice.reducer;