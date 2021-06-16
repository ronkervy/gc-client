import { createDraftSafeSelector, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { searchProduct, selectAllProducts, selectSingleProduct } from './productServices';

const productsAdapter = createEntityAdapter({
    selectId : (prod)=>prod._id,
    sortComparer : (prod)=>prod.createdAt
});

const productSlice = createSlice({
    name : 'products',
    initialState : productsAdapter.getInitialState({
        loading : true,
        selectedProd : [],
        error : null,
    }),
    reducers : {},
    extraReducers : (builder)=>{
        //FETCH ALL PRODUCTS
        builder.addCase(selectAllProducts.pending,state=>{
            state.loading = true;
        })
        .addCase(selectAllProducts.fulfilled,(state,{payload})=>{
            state.loading = false;
            productsAdapter.setAll(state,payload);
        })
        .addCase(selectAllProducts.rejected,(state,{payload})=>{
            state.loading = false;                
            state.error = payload;
        })
        //FIND PRODUCT/S
        .addCase(searchProduct.pending,state=>{
            state.loading = true;
        })
        .addCase(searchProduct.fulfilled,(state,{payload})=>{
            state.loading = false;
            productsAdapter.setAll(state,payload);
        })
        .addCase(searchProduct.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //FETCH SINGLE PRODUCT
        .addCase(selectSingleProduct.pending,(state,{payload})=>{
            state.loading = true;
        })
        .addCase(selectSingleProduct.fulfilled,(state,{payload})=>{
            state.loading = false;
            productsAdapter.addOne(state,payload);
        })
        .addCase(selectSingleProduct.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
        //CREATE TRANSACTION
        
        
    }
});

const selectState = state=>state.products;

export const loadingSelector = createDraftSafeSelector(
    selectState,
    state=>state.loading
);

export const productsSelector = productsAdapter.getSelectors(state=>state.products);
export default productSlice.reducer;