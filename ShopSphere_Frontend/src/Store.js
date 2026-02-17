import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, getMyOrders } from "./api/axios";

/* ==============================
   PRODUCTS THUNK
================================ */

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await getProducts();
    console.log("Fetched products:", response);

    const all = response;

    const electronics = response.filter(
      (item) => item.category?.toLowerCase() === "electronics"
    );

    const sports = response.filter(
      (item) => {
        const category = item.category?.toLowerCase();
        return category === "sports" || category === "sports_fitness";
      }
    );

    const fashion = response.filter(
      (item) => item.category?.toLowerCase() === "fashion"
    );

    const books = response.filter(
      (item) => item.category?.toLowerCase() === "books"
    );

    const home_kitchen = response.filter(
      (item) => {
        const category = item.category?.toLowerCase();
        return category === "home_kitchen" || category === "home & kitchen";
      }
    );

    const beauty = response.filter(
      (item) => {
        const category = item.category?.toLowerCase();
        return category === "beauty" || category === "beauty_personal_care" || category === "beauty & personal care";
      }
    );

    const toys = response.filter(
      (item) => {
        const category = item.category?.toLowerCase();
        return category === "toys" || category === "toys_games" || category === "toys & games";
      }
    );

    const automotive = response.filter(
      (item) => item.category?.toLowerCase() === "automotive"
    );

    const grocery = response.filter(
      (item) => item.category?.toLowerCase() === "grocery"
    );

    const services = response.filter(
      (item) => item.category?.toLowerCase() === "services"
    );

    return {
      all,
      electronics,
      fashion,
      home_kitchen,
      beauty,
      sports,
      toys,
      automotive,
      grocery,
      books,
      services,
    };
  }
);

/* ==============================
   PRODUCTS SLICE
================================ */

const productsSlice = createSlice({
  name: "products",
  initialState: {
    all: [],
    electronics: [],
    fashion: [],
    home_kitchen: [],
    beauty: [],
    sports: [],
    toys: [],
    automotive: [],
    grocery: [],
    books: [],
    services: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.all = action.payload.all;
        state.electronics = action.payload.electronics;
        state.fashion = action.payload.fashion;
        state.home_kitchen = action.payload.home_kitchen;
        state.beauty = action.payload.beauty;
        state.sports = action.payload.sports;
        state.toys = action.payload.toys;
        state.automotive = action.payload.automotive;
        state.grocery = action.payload.grocery;
        state.books = action.payload.books;
        state.services = action.payload.services;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

//  CART SLICE

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    AddToCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      const qtyToAdd = action.payload.quantity || 1;
      if (item) item.quantity += qtyToAdd;
      else state.push({ ...action.payload, quantity: qtyToAdd });
    },
    IncrCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (item) item.quantity += 1;
    },
    DecrCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (item && item.quantity > 1) item.quantity -= 1;
      else return state.filter(i => i.name !== action.payload.name);
    },
    RemoveFromCart: (state, action) =>
      state.filter(i => i.name !== action.payload.name),
    clearCart: () => [],
  }
});

export const {
  AddToCart,
  IncrCart,
  DecrCart,
  RemoveFromCart,
  clearCart
} = cartSlice.actions;

// WISHLIST SLICE

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    AddToWishlist: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (!item) state.push(action.payload);
    },
    RemoveFromWishlist: (state, action) =>
      state.filter(i => i.name !== action.payload.name),
    clearWishlist: () => [],
  }
});

export const {
  AddToWishlist,
  RemoveFromWishlist,
  clearWishlist
} = wishlistSlice.actions;

// ORDERS SLICE

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyOrders();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// STORE

const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    order: orderSlice.reducer,
  },
});

export default store;
