import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrders } from "./api/axios";

//  PRODUCTS SLICE

const productsSlice = createSlice({
  name: "products",
  initialState: {
    electronics: [
      {
        name: "Watch",
        price: 2499,
        image: "/public/watch.jpg",
        description: "Elegant wrist watch with accurate timekeeping for daily and formal use."
      },
      {
        name: "Laptop",
        price: 55999,
        image: "/public/laptop.jpg",
        description: "High-performance laptop suitable for work, study, and entertainment."
      },
      {
        name: "phone",
        price: 18999,
        image: "/public/phone.jpg",
        description: "Smartphone with modern features, clear display, and long battery life."
      },
      {
        name: "charger",
        price: 799,
        image: "/public/charger.jpg",
        description: "Fast charging adapter compatible with multiple devices."
      },
      {
        name: "computer",
        price: 42999,
        image: "/public/computer.jpg",
        description: "Desktop computer for office work and everyday computing."
      },
      {
        name: "mouse",
        price: 699,
        image: "/public/mouse.jpg",
        description: "Ergonomic mouse with smooth tracking and comfortable grip."
      },
      {
        name: "keyboard",
        price: 999,
        image: "/public/keyboard.jpg",
        description: "Durable keyboard with soft keys for efficient typing."
      },
      {
        name: "tv",
        price: 32999,
        image: "/public/tv.jpg",
        description: "Full HD television with vibrant colors and immersive sound."
      },
      {
        name: "remote",
        price: 499,
        image: "/public/remote.jpg",
        description: "Easy-to-use remote control with responsive buttons."
      },
      {
        name: "Buds",
        price: 1999,
        image: "/public/buds.jpg",
        description: "Wireless earbuds with clear sound and noise isolation."
      }
    ],

    // fruits: [
    //   {
    //     name: "Kiwi",
    //     price: 180,
    //     image: "/public/kiwi.jpg",
    //     description: "Fresh kiwi rich in vitamin C and antioxidants."
    //   },
    //   {
    //     name: "Watermelon",
    //     price: 60,
    //     image: "/public/watermelon.jpg",
    //     description: "Sweet and juicy watermelon perfect for hydration."
    //   },
    //   {
    //     name: "Grapes",
    //     price: 120,
    //     image: "/public/grapes.jpg",
    //     description: "Fresh grapes with natural sweetness and nutrients."
    //   },
    //   {
    //     name: "Banana",
    //     price: 55,
    //     image: "/public/banana.jpg",
    //     description: "Naturally sweet bananas rich in potassium."
    //   },
    //   {
    //     name: "Plum",
    //     price: 160,
    //     image: "/public/plum.jpg",
    //     description: "Juicy plums with a sweet and tangy taste."
    //   },
    //   {
    //     name: "Apples",
    //     price: 140,
    //     image: "/public/apples.jpg",
    //     description: "Crisp apples ideal for healthy snacking."
    //   },
    //   {
    //     name: "Dragon Fruit",
    //     price: 220,
    //     image: "/public/Dragon Fruit.jpg",
    //     description: "Exotic dragon fruit rich in fiber and antioxidants."
    //   },
    //   {
    //     name: "Mango",
    //     price: 180,
    //     image: "/public/mango.jpg",
    //     description: "Sweet and flavorful mangoes loved by all ages."
    //   }
    // ],

    // vegetables: [
    //   {
    //     name: "Tomato",
    //     price: 40,
    //     image: "/public/tomato.jpg",
    //     description: "Fresh tomatoes ideal for curries and salads."
    //   },
    //   {
    //     name: "Coriander",
    //     price: 30,
    //     image: "/public/coriander.jpg",
    //     description: "Fresh coriander leaves for garnishing and flavor."
    //   },
    //   {
    //     name: "Onion",
    //     price: 35,
    //     image: "/public/onions.jpg",
    //     description: "Essential kitchen onion with strong aroma."
    //   },
    //   {
    //     name: "Capsicum-Green",
    //     price: 60,
    //     image: "/public/Capsicum - Green.jpg",
    //     description: "Crunchy green capsicum for stir-fries and salads."
    //   },
    //   {
    //     name: "Carrot",
    //     price: 45,
    //     image: "/public/carrot.jpg",
    //     description: "Sweet carrots rich in vitamin A."
    //   },
    //   {
    //     name: "Spinach",
    //     price: 30,
    //     image: "/public/spinach.jpg",
    //     description: "Leafy spinach packed with iron and nutrients."
    //   },
    //   {
    //     name: "Potato",
    //     price: 30,
    //     image: "/public/potato.jpg",
    //     description: "Versatile potatoes suitable for daily cooking."
    //   },
    //   {
    //     name: "Broccoli",
    //     price: 90,
    //     image: "/public/broccoli.jpg",
    //     description: "Healthy broccoli rich in vitamins."
    //   },
    //   {
    //     name: "Garlic",
    //     price: 70,
    //     image: "/public/garlic.jpg",
    //     description: "Aromatic garlic used in everyday cooking."
    //   },
    //   {
    //     name: "Ginger",
    //     price: 60,
    //     image: "/public/ginger.jpg",
    //     description: "Fresh ginger with strong flavor and health benefits."
    //   },
    //   {
    //     name: "Cabbage",
    //     price: 50,
    //     image: "/public/cabbage.jpg",
    //     description: "Crisp cabbage ideal for salads and curries."
    //   },
    //   {
    //     name: "Coconut",
    //     price: 45,
    //     image: "/public/coconut.jpg",
    //     description: "Fresh coconut with natural sweetness."
    //   },
    //   {
    //     name: "Mushroom",
    //     price: 110,
    //     image: "/public/mushroom.jpg",
    //     description: "Fresh mushrooms rich in protein."
    //   },
    //   {
    //     name: "Beans",
    //     price: 60,
    //     image: "/public/beans.jpg",
    //     description: "Fresh green beans packed with fiber."
    //   }
    // ],

    // milkproducts: [
    //   {
    //     name: "Full Cream Milk",
    //     price: 68,
    //     image: "/public/Amul Milk.jpg",
    //     description: "Rich full-cream milk with high fat content."
    //   },
    //   {
    //     name: "Amul Butter",
    //     price: 55,
    //     image: "/public/Amul Butter.jpg",
    //     description: "Creamy Amul butter perfect for cooking and spreading."
    //   },
    //   {
    //     name: "Amul Butter Milk",
    //     price: 25,
    //     image: "/public/Amul Buttermilk.jpg",
    //     description: "Refreshing buttermilk aiding digestion."
    //   },
    //   {
    //     name: "amul Cheese",
    //     price: 120,
    //     image: "/public/Amul Cheese.jpg",
    //     description: "Soft and rich Amul cheese slices."
    //   },
    //   {
    //     name: "Amul Cool Kesar",
    //     price: 35,
    //     image: "/public/Amul Cool Kesar.jpg",
    //     description: "Sweet kesar-flavored milk drink."
    //   },
    //   {
    //     name: "Amul Lassi",
    //     price: 30,
    //     image: "/public/Amul Lassi.jpg",
    //     description: "Thick and refreshing yogurt-based lassi."
    //   },
    //   {
    //     name: "Amul Panner",
    //     price: 95,
    //     image: "/public/Amul Panner.jpg",
    //     description: "Fresh paneer ideal for curries."
    //   },
    //   {
    //     name: "Chocolate Milk",
    //     price: 40,
    //     image: "/public/Chocolate Milk.jpg",
    //     description: "Sweet chocolate-flavored milk drink."
    //   }
    // ],

    // snacks: [
    //   {
    //     name: "Bingo Original",
    //     price: 20,
    //     image: "/public/Bingo Original.jpg",
    //     description: "Crispy salted potato chips."
    //   },
    //   {
    //     name: "Jim Jam",
    //     price: 35,
    //     image: "/public/Jim Jam.jpg",
    //     description: "Crunchy biscuits with jam filling."
    //   },
    //   {
    //     name: "Kur Kure Green Chutney",
    //     price: 15,
    //     image: "/public/Kur Kure Green Chutney Style.jpg",
    //     description: "Tangy Indian snacks."
    //   },
    //   {
    //     name: "Lays",
    //     price: 20,
    //     image: "/public/Lays.jpg",
    //     description: "Classic potato chips."
    //   },
    //   {
    //     name: "Little Hearts",
    //     price: 10,
    //     image: "/public/Little Hearts.jpg",
    //     description: "Sweet heart-shaped biscuits."
    //   },
    //   {
    //     name: "Lotte Choco Pie",
    //     price: 30,
    //     image: "/public/Lotte Choco Pie.jpg",
    //     description: "Marshmallow-filled chocolate snack."
    //   },
    //   {
    //     name: "Maggie",
    //     price: 14,
    //     image: "/public/Maggie.jpg",
    //     description: "Quick and easy instant noodles."
    //   },
    //   {
    //     name: "Moms Magic",
    //     price: 30,
    //     image: "/public/Moms Magic.jpg",
    //     description: "Buttery nut biscuits."
    //   },
    //   {
    //     name: "Monaco",
    //     price: 10,
    //     image: "/public/Monaco.jpg",
    //     description: "Salty and crispy biscuits."
    //   },
    //   {
    //     name: "Choco Cakes",
    //     price: 25,
    //     image: "/public/choco cakes.jpg",
    //     description: "Soft chocolate cakes."
    //   },
    //   {
    //     name: "ChocoChip Cookies",
    //     price: 40,
    //     image: "/public/Chocochip Cookies.jpg",
    //     description: "Loaded with chocolate chips."
    //   },
    //   {
    //     name: "Kur Kure Chilli",
    //     price: 15,
    //     image: "/public/kur kure.jpg",
    //     description: "Hot and spicy Indian snack."
    //   }
    // ],

    // chocolates: [
    //   {
    //     name: "Dairy Milk Special Silk",
    //     price: 180,
    //     image: "/public/Dairy Milk Special Silk.jpg",
    //     description: "Smooth and creamy silk chocolate."
    //   },
    //   {
    //     name: "Dark Chocolate",
    //     price: 120,
    //     image: "/public/Dark Chocolate.jpg",
    //     description: "Rich dark chocolate with intense cocoa."
    //   },
    //   {
    //     name: "Dairy Milk Bubbly",
    //     price: 90,
    //     image: "/public/Dairy Milk Bubbly.jpg",
    //     description: "Light and airy bubbly chocolate."
    //   },
    //   {
    //     name: "Chocolush",
    //     price: 150,
    //     image: "/public/chocolush.jpg",
    //     description: "Premium filled chocolate treat."
    //   },
    //   {
    //     name: "Dairy Milk Classics",
    //     price: 45,
    //     image: "/public/Dairy Milk Classics.jpg",
    //     description: "Original milk chocolate flavor."
    //   },
    //   {
    //     name: "Dairy Milk Hearts&Roses",
    //     price: 250,
    //     image: "/public/Dairy Milk Hearts&Roses.jpg",
    //     description: "Perfect gift for special occasions."
    //   },
    //   {
    //     name: "Dairy Milk Hazelnut",
    //     price: 110,
    //     image: "/public/Dairy Milk Hezelnut.jpg",
    //     description: "Milk chocolate with nutty hazelnuts."
    //   },
    //   {
    //     name: "Dairy Milk Roasted Almond",
    //     price: 110,
    //     image: "/public/Dairy Milk Roasted Almond.jpg",
    //     description: "Crunchy roasted almonds in chocolate."
    //   },
    //   {
    //     name: "Dairy Milk Silk Fruit&Nut",
    //     price: 185,
    //     image: "/public/Dairy milk Silk Fruit&Nut.jpg",
    //     description: "Fruity and nutty milk chocolate."
    //   },
    //   {
    //     name: "Dairy Milk Silk",
    //     price: 110,
    //     image: "/public/Dairy milk silk.jpg",
    //     description: "Pure velvety milk chocolate."
    //   }
    // ],

    sports: [
      {
        name: "Cricket Bat",
        price: 1500,
        image: "/public/Sports/1.jpg",
        description: "High-quality willow cricket bat."
      },
      {
        name: "Football",
        price: 999,
        image: "/public/Sports/2.jpg",
        description: "Professional size 5 football."
      },
      {
        name: "Badminton Racket",
        price: 1200,
        image: "/public/Sports/3.jpg",
        description: "Lightweight carbon fiber racket."
      },
      {
        name: "Basketball",
        price: 850,
        image: "/public/Sports/4.jpg",
        description: "All-surface grip basketball."
      },
      {
        name: "Tennis Ball",
        price: 150,
        image: "/public/Sports/5.jpg",
        description: "Durable wool felt tennis ball."
      },
      {
        name: "Yoga Mat",
        price: 600,
        image: "/public/Sports/6.jpg",
        description: "Non-slip cushioned yoga mat."
      },
      {
        name: "Dumbbells",
        price: 2500,
        image: "/public/Sports/7.jpg",
        description: "Adjustable weight dumbbell set."
      },
      {
        name: "Skip Rope",
        price: 300,
        image: "/public/Sports/8.jpg",
        description: "High-speed jumping rope."
      },
      {
        name: "Helmet",
        price: 1800,
        image: "/public/Sports/9.jpg",
        description: "Protective sports safety helmet."
      }
    ],

    fashion: [
      {
        name: "Casual T-Shirt",
        price: 599,
        image: "/public/Fashion/1.jpg",
        description: "Comfortable cotton t-shirt."
      },
      {
        name: "Slim Fit Jeans",
        price: 1499,
        image: "/public/Fashion/2.jpg",
        description: "Classic blue denim jeans."
      },
      {
        name: "Formal Shirt",
        price: 899,
        image: "/public/Fashion/3.jpg",
        description: "Elegant white formal shirt."
      },
      {
        name: "Leather Jacket",
        price: 3500,
        image: "/public/Fashion/4.jpg",
        description: "Stylish black leather jacket."
      },
      {
        name: "Hoodie",
        price: 1200,
        image: "/public/Fashion/5.jpg",
        description: "Warm fleece-lined hoodie."
      },
      {
        name: "Cotton Trousers",
        price: 1100,
        image: "/public/Fashion/6.jpg",
        description: "Breathable summer trousers."
      },
      {
        name: "Canvas Shoes",
        price: 1800,
        image: "/public/Fashion/7.jpg",
        description: "Trendy casual canvas shoes."
      },
      {
        name: "Summer Dress",
        price: 1600,
        image: "/public/Fashion/8.jpg",
        description: "Light floral print dress."
      },
      {
        name: "Denim Shorts",
        price: 799,
        image: "/public/Fashion/9.jpg",
        description: "Cool casual denim shorts."
      },
      {
        name: "Silk Scarf",
        price: 450,
        image: "/public/Fashion/10.jpg",
        description: "Soft elegant silk scarf."
      },
      {
        name: "Winter Coat",
        price: 4500,
        image: "/public/Fashion/11.jpg",
        description: "Heavy insulation winter coat."
      }
    ],

    books: [
      {
        name: "Mindset",
        price: 350,
        image: "/public/Books/1.jpg",
        description: "A classic novel by F. Scott Fitzgerald."
      },
      {
        name: "Deep Work",
        price: 400,
        image: "/public/Books/2.jpg",
        description: "A powerful story by Harper Lee."
      },
      {
        name: "Surrounded By Idiots",
        price: 300,
        image: "/public/Books/3.jpg",
        description: "George Orwell's dystopian masterpiece."
      },
      {
        name: "Ego is the enemy",
        price: 550,
        image: "/public/Books/4.jpg",
        description: "Tiny changes, remarkable results."
      },
      {
        name: "The Subtle Art of Not Giving a F*ck",
        price: 320,
        image: "/public/Books/5.jpg",
        description: "A journey of following your dreams."
      },
      {
        name: "The Laws of Human Nature",
        price: 600,
        image: "/public/Books/6.jpg",
        description: "Insights into how we think."
      },
      {
        name: "Women Who Think To much",
        price: 450,
        image: "/public/Books/7.jpg",
        description: "A memoir by Tara Westover."
      },
      {
        name: "The Art Of Happiness",
        price: 380,
        image: "/public/Books/8.jpg",
        description: "A gripping psychological thriller."
      },
      {
        name: "Better than The Movies",
        price: 420,
        image: "/public/Books/9.jpg",
        description: "Financial lessons for life."
      },
      {
        name: "You Become What you Think",
        price: 500,
        image: "/public/Books/10.jpg",
        description: "The magic begins."
      },
      {
        name: "Good vibes Good Life",
        price: 299,
        image: "/public/Books/e379c28be0aa06727d81a80b7f6d48b5.jpg",
        description: "Timeless wisdom on competition."
      }
    ],

    accessories: [
      {
        name: "Leather Wallet",
        price: 800,
        image: "/public/Accessories/1.jpg",
        description: "Genuine leather slim wallet."
      },
      {
        name: "Sunglasses",
        price: 1200,
        image: "/public/Accessories/2.jpg",
        description: "UV protection stylish sunglasses."
      },
      {
        name: "Handbag",
        price: 2500,
        image: "/public/Accessories/3.jpg",
        description: "Spacious designer handbag."
      },
      {
        name: "Backpack",
        price: 1800,
        image: "/public/Accessories/4.jpg",
        description: "Waterproof laptop backpack."
      },
      {
        name: "Belt",
        price: 600,
        image: "/public/Accessories/5.jpg",
        description: "Classic brown leather belt."
      },
      {
        name: "Watch Box",
        price: 1500,
        image: "/public/Accessories/6.jpg",
        description: "Premium watch organizer."
      },
      {
        name: "Jewelry Set",
        price: 3000,
        image: "/public/Accessories/7.jpg",
        description: "Elegant gold-plated set."
      },
      {
        name: "Premium Tie",
        price: 750,
        image: "/public/Accessories/e5402bafe5ba36e5bbfa2502ec0b1398.jpg",
        description: "Formal silk necktie."
      }
    ]
  },
  reducers: {}
});

//  CART SLICE

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    AddToCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (item) item.quantity += 1;
      else state.push({ ...action.payload, quantity: 1 });
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
