import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrders, getProducts } from "./api/axios";

// ─── Persistence Helpers (Cart & Wishlist) ──────────────────────────────────
// Persist data per-user: key = "cart_<userEmail>" so each account is isolated
const getUserEmail = () => {
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u).email : "guest";
  } catch {
    return "guest";
  }
};

const loadFromStorage = (type) => { // type = 'cart' or 'wishlist'
  try {
    const key = `${type}_${getUserEmail()}`;
    const serialized = localStorage.getItem(key);
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (type, state) => {
  try {
    const key = `${type}_${getUserEmail()}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.error(`Failed to save ${type} to localStorage:`, err);
  }
};

const clearFromStorage = (type) => {
  try {
    const key = `${type}_${getUserEmail()}`;
    localStorage.removeItem(key);
  } catch {/* ignore */ }
};
// ─────────────────────────────────────────────────────────────────────────────

// PRODUCTS SLICE

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getProducts(params);
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

        const productsData = action.payload;
        const products = Array.isArray(productsData)
          ? productsData
          : (productsData?.results || []);

        const processedProducts = products.map(product => {
          const gallery = product.images && product.images.length > 0
            ? product.images.map(img => {
              let imgPath = typeof img === 'string' ? img : (img.image || img.url);
              if (!imgPath) return "/public/placeholder.jpg";
              if (imgPath.startsWith('http')) return imgPath;
              if (imgPath.startsWith('/')) return `http://localhost:8000${imgPath}`;
              return `http://localhost:8000/${imgPath}`;
            })
            : ["/public/placeholder.jpg"];

          return {
            ...product, // Preserve all backend fields
            image: gallery[0],
            gallery: gallery,
            vendor: product.vendor_name,
            price: Number(product.price)
          };
        });

        state.all = processedProducts;

        // Reset and Redistribute categories
        const categorized = {
          electronics: [], sports: [], fashion: [], books: [], home_kitchen: [],
          grocery: [], beauty_personal_care: [], toys_games: [], automotive: [],
          services: [], other: []
        };

        processedProducts.forEach(p => {
          const cat = p.category?.toLowerCase();
          if (cat === 'electronics') categorized.electronics.push(p);
          else if (cat === 'sports' || cat === 'sports_fitness') categorized.sports.push(p);
          else if (cat === 'fashion') categorized.fashion.push(p);
          else if (cat === 'books') categorized.books.push(p);
          else if (cat === 'home_kitchen') categorized.home_kitchen.push(p);
          else if (cat === 'grocery') categorized.grocery.push(p);
          else if (cat === 'beauty_personal_care') categorized.beauty_personal_care.push(p);
          else if (cat === 'toys_games') categorized.toys_games.push(p);
          else if (cat === 'automotive') categorized.automotive.push(p);
          else if (cat === 'services') categorized.services.push(p);
          else categorized.other.push(p);
        });

        Object.keys(categorized).forEach(key => {
          state[key] = categorized[key];
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

//  CART SLICE — initialized from localStorage so it survives page refresh

const cartSlice = createSlice({
  name: "cart",
  initialState: loadFromStorage('cart'), // ✅ Load from localStorage on app start
  reducers: {
    AddToCart: (state, action) => {
      const existingItem = state.find(
        item => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    IncrCart: (state, action) => {
      const item = state.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },

    DecrCart: (state, action) => {
      const index = state.findIndex(i => i.id === action.payload.id);

      if (index !== -1) {
        if (state[index].quantity > 1) {
          state[index].quantity -= 1;
        } else {
          state.splice(index, 1);
        }
      }
    },

    RemoveFromCart: (state, action) => {
      return state.filter(i => i.id !== action.payload.id);
    },

    clearCart: () => {
      clearFromStorage('cart'); // ✅ Also clear from localStorage
      return [];
    },

    syncCart: () => {
      return loadFromStorage('cart');
    },
  },
});

export const {
  AddToCart,
  IncrCart,
  DecrCart,
  RemoveFromCart,
  clearCart,
  syncCart
} = cartSlice.actions;


// WISHLIST SLICE

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: loadFromStorage('wishlist'), // ✅ Load from localStorage on app start
  reducers: {
    AddToWishlist: (state, action) => {
      const item = state.find(i => i.id === action.payload.id || i.name === action.payload.name);
      if (!item) state.push(action.payload);
    },
    RemoveFromWishlist: (state, action) =>
      state.filter(i => (i.id !== action.payload.id && i.name !== action.payload.name)),
    clearWishlist: () => {
      clearFromStorage('wishlist');
      return [];
    },
    syncWishlist: () => {
      return loadFromStorage('wishlist');
    },
  }
});

export const {
  AddToWishlist,
  RemoveFromWishlist,
  clearWishlist,
  syncWishlist
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
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.isLoading = false;
      state.error = null;
    }
  },
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

export const { clearOrders } = orderSlice.actions;

// STORE

const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
    order: orderSlice.reducer,
  },
});

// ✅ Subscribe to store changes and persist state to localStorage after every action
store.subscribe(() => {
  const state = store.getState();
  saveToStorage('cart', state.cart);
  saveToStorage('wishlist', state.wishlist);
});

export default store;
