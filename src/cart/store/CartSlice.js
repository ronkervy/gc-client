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
                discount,
                item_price,
                item_qty,
                inventory_qty,
                item_unit,
                item_srp
            } = payload;

            const qty = item_qty;
            const calcDiscount = discount / 100;            

            if( index !== -1 ) {

                const total_qty_price = (parseInt(state.cart[index].qty) + parseInt(qty)) * item_price;
                const total_qty_srp = (parseInt(state.cart[index].qty) + parseInt(qty)) * item_srp;
                const currentDiscount = discount !== 0 ? discount / 100 : state.cart[index].discount;
    
                const withDiscount_per_unit = currentDiscount !== 0 ? total_qty_price - (total_qty_price * currentDiscount) : total_qty_price;
                const withDiscount_per_unit_srp = currentDiscount !== 0 ? total_qty_srp - ( total_qty_srp * currentDiscount ) : total_qty_srp;

                state.cart[index].qty = parseInt(state.cart[index].qty) + parseInt(qty);
                state.cart[index].total_per_unit = withDiscount_per_unit;
                state.cart[index].total_per_unit_srp = withDiscount_per_unit_srp;
                state.cart[index].discount = discount !== 0 ? discount / 100 : state.cart[index].discount;

                if( qty > inventory_qty ){
                    state.cart[index].error = true;                    
                }

            }else{

                const total_qty_price = qty * item_price;
                const total_qty_srp = qty * item_srp;
    
                const withDiscount_per_unit = calcDiscount !== 0 ? total_qty_price - (total_qty_price * calcDiscount) : total_qty_price;
                const withDiscount_per_unit_srp = calcDiscount !== 0 ? total_qty_srp - ( total_qty_srp * calcDiscount ) : total_qty_srp;

                state.cart.unshift({
                    _id,
                    item_name,
                    item_price,
                    item_srp,
                    inventory_qty,
                    error : false,
                    qty,
                    discount : calcDiscount,
                    total_per_unit : withDiscount_per_unit,
                    total_per_unit_srp : withDiscount_per_unit_srp,
                    item_unit
                });
            }
        },
        updateQty : (state,{payload})=>{
            
            const {
                _id,
                qty,
                item_price,
                inventory_qty,
                item_srp
            } = payload;            

            const index = state.cart.findIndex(prod=>prod._id === _id);

            let val = qty === NaN ? 0 : parseInt(qty);
            let total_qty_price = val * item_price;
            let total_qty_srp = val * item_srp;

            if( index !== -1 ){
                state.cart[index].qty = val; 
                state.cart[index].total_per_unit = state.cart[index].discount !== 0 ? total_qty_price - ((total_qty_price) * state.cart[index].discount) : total_qty_price;
                state.cart[index].total_per_unit_srp = state.cart[index].discount !== 0 ? total_qty_srp - ((total_qty_srp) * state.cart[index].discount) : total_qty_srp;

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
                item_srp,
                qty
            } = payload;          

            const index = state.cart.findIndex(prod=>prod._id === _id);
            const calcDiscount = discount / 100;
            const total = item_price * qty;
            const total_srp = item_srp * qty;

            if(index !== -1){
                state.cart[index].discount = calcDiscount;
                state.cart[index].total_per_unit = discount !== 0 ? total - (total * calcDiscount) : item_price * qty;
                state.cart[index].total_per_unit_srp = discount !== 0 ? total_srp - (total_srp * calcDiscount) : item_srp * qty;
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