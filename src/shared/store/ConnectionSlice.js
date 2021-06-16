import { createSlice } from '@reduxjs/toolkit';

const ConnectionSlice = createSlice({
    name : 'connection',
    initialState : {
        isConnected : false
    },
    reducers : {
        setConnection : (state,{payload})=>{
            state.isConnected = payload;
        }
    }
});
export const { setConnection } = ConnectionSlice.actions;
export default ConnectionSlice.reducer;