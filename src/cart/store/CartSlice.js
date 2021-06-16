import { createSlice,createEntityAdapter,createDraftSafeSelector } from '@reduxjs/toolkit';
import { CreateTransaction } from './CartServices';

const cartAdapter = createEntityAdapter({
    selectId : prod=>prod._id
});

const CartSlice = createSlice({
    name : 'cart',
    initialState : cartAdapter.getInitialState({
        cart : [],
        loading : false,
        error : ''
    }),
    reducers : {
        addItem : (state,{payload})=>{

            const index = state.cart.findIndex(prod=>prod._id === payload._id);

            const {
                _id,
                item_name,
                item_price,
                item_qty
            } = payload;

            const qty = 1;
            const discount = 0;

            if( index !== -1 ) {
                state.cart[index].qty = parseInt(state.cart[index].qty) + 1;
                state.cart[index].total_per_unit = parseInt(state.cart[index].qty) * item_price;
            }else{
                state.cart.unshift({
                    _id,
                    item_name,
                    item_price,
                    inventory_qty : item_qty,
                    error : false,
                    qty,
                    discount,
                    total_per_unit : qty * item_price
                });
            }
        },
        updateQty : (state,{payload})=>{
            const {
                _id,
                qty,
                item_price,
                inventory_qty
            } = payload;            

            const index = state.cart.findIndex(prod=>prod._id === _id);
            let val = qty === NaN ? 0 : parseInt(qty);

            if( index !== -1 ){
                state.cart[index].qty = val;
                state.cart[index].total_per_unit = val * item_price

                if( val > inventory_qty ){
                    state.cart[index].error = true;
                }else{
                    state.cart[index].error = false;
                }

            }

        },
        setDiscount : (state,{payload})=>{
            const {
                _id,
                discount,
                item_price,
                qty
            } = payload;            

            const index = state.cart.findIndex(prod=>prod._id === _id);
            const calcDiscount = discount / 100;
            const total = item_price * qty;

            if(index !== -1){
                state.cart[index].discount = calcDiscount;
                state.cart[index].total_per_unit = discount !== 0 ? total - (total * calcDiscount) : item_price * qty;
            }

        },
        removeItem : (state,{payload})=>{
            const index = state.cart.findIndex(prod=>prod._id === payload);
            state.cart.splice(index,1);
        }
    },
    extraReducers : (builder)=>{
        builder.addCase( CreateTransaction.pending,state=>{
            state.loading = true;
        })
        .addCase( CreateTransaction.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.cart = [];
        })
        .addCase( CreateTransaction.rejected,(state,{payload})=>{
            state.loading = false;
            state.error = payload;
        })
    }
});

const selectCart = (state)=>state.cart;
export const cartItems = createDraftSafeSelector(
    selectCart,
    state=>state.cart
);
export const cartLoading = createDraftSafeSelector(
    selectCart,
    state=>state.loading
);
export const { addItem,removeItem,updateQty,setDiscount } = CartSlice.actions;
export default CartSlice.reducer;