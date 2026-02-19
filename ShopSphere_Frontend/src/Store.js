import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrders, getProducts } from "./api/axios";

// PRODUCTS SLICE

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProducts();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    electronics: [],
    sports: [],
    fashion: [],
    books: [],
    home_kitchen: [],
    grocery: [],
    beauty_personal_care: [],
    toys_games: [],
    automotive: [],
    services: [],
    other: [],
    all: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.all = action.payload;

        // Reset categories
        state.electronics = [];
        state.sports = [];
        state.fashion = [];
        state.books = [];
        state.home_kitchen = [];
        state.grocery = [];
        state.beauty_personal_care = [];
        state.toys_games = [];
        state.automotive = [];
        state.services = [];
        state.other = [];

        // Distribute products into categories
        action.payload.forEach(product => {
          const category = product.category?.toLowerCase();

          const gallery = product.images && product.images.length > 0
            ? product.images.map(img => {
              const imgPath = img.image;
              if (imgPath.startsWith('http')) return imgPath;
              if (imgPath.startsWith('/media/')) return `http://localhost:8000${imgPath}`;
              if (imgPath.startsWith('media/')) return `http://localhost:8000/${imgPath}`;
              return `http://localhost:8000/media/${imgPath}`;
            })
            : ["/public/placeholder.jpg"];

          const p = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: gallery[0],
            gallery: gallery,
            description: product.description,
            vendor: product.vendor_name
          };

          if (category === 'electronics') state.electronics.push(p);
          else if (category === 'sports' || category === 'sports_fitness') state.sports.push(p);
          else if (category === 'fashion') state.fashion.push(p);
          else if (category === 'books') state.books.push(p);
          else if (category === 'home_kitchen') state.home_kitchen.push(p);
          else if (category === 'grocery') state.grocery.push(p);
          else if (category === 'beauty_personal_care') state.beauty_personal_care.push(p);
          else if (category === 'toys_games') state.toys_games.push(p);
          else if (category === 'automotive') state.automotive.push(p);
          else if (category === 'services') state.services.push(p);
          else state.other.push(p);
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
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
