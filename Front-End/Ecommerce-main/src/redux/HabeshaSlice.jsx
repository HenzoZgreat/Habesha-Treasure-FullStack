import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartProducts: JSON.parse(localStorage.getItem('cartProducts')) || [],
  allApiProducts: [],
  userInfo: [],
  currentSearchTerm: "",
  language: "EN",
};

export const habeshaSlice = createSlice({
  name: "habesha",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.cartProducts.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.cartProducts.push(action.payload);
      }
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    incrementQuantity: (state, action) => {
      const item = state.cartProducts.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    decrementQuantity: (state, action) => {
      const item = state.cartProducts.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
        } else {
          item.quantity -= 1;
        }
      }
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    deleteItem: (state, action) => {
      state.cartProducts = state.cartProducts.filter((item) => item.id !== action.payload);
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    resetCart: (state) => {
      state.cartProducts = [];
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    setCart: (state, action) => {
      state.cartProducts = action.payload;
      localStorage.setItem('cartProducts', JSON.stringify(state.cartProducts));
    },
    setAllProducts: (state, action) => {
      state.allApiProducts = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.currentSearchTerm = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {
  addToCart,
  deleteItem,
  resetCart,
  incrementQuantity,
  decrementQuantity,
  setCart,
  setAllProducts,
  setUserInfo,
  setSearchTerm,
  setLanguage,
} = habeshaSlice.actions;

export default habeshaSlice.reducer;