import { configureStore, createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    fruit: [
      {
        name: 'Watch',
        price: 120.0,
        image: '/Images/watch.png',
        description: 'Your Everyday sweet, crisp and juicy with a balanced flavor. '
      },
      {
        name: 'Laptop',
        price: 100.0,
        image: '/Images/laptop.png',
        description: 'Sweet & buttery texture but the flesh inside and soft'
      },
      {
        name: 'phone',
        price: 40.0,
        image: '/Images/phone.png',
        description: 'Tiny, sweet bananas; kid friendly snack, easy to digest.'
      },
      {
        name: 'charger',
        price: 60.0,
        image: '/Images/charger.png',
        description: 'Bright, rich in flavor, round and juicy, It is high in vitamin C.'
      },
      {
        name: 'computer',
        price: 90.0,
        image: '/Images/computer.png',
        description: 'Enjoy the sweet, tangy flavor, free from harmful chemicals.' 
      },
      {
        name: 'mouse',
        price: 150.0,
        image: '/Images/mouse.png',
        description: 'Semi red with tangy kick and each of them surrounds a tiny seed.'
      },
      {
        name: 'keyboard',
        price: 70.0,
        image: '/Images/keyboard.png',
        description: 'Early season, juicy, sweet and sour taste, best snacks for you.'
      },
      {
        name: 'tv',
        price: 80.0,
        image: '/Images/tv.png',
        description: 'Fresh, Sweet, soft fruit; boosts digestion, ready to eat.'
      },
      {
        name: 'remote',
        price: 55.0,
        image: '/Images/remote.png',
        description: ' "Queen of fruits", A highly prolific fruit crop, it is globally renowned.' 
      },
      {
        name: 'Kiwi',
        price: 130.0,
        image: '/Images/kiwi.png',
        description: 'Tangy, juicy fruit loaded with vitamins and nutrients. Take daily'
      },
      {
        name: 'Watermelon',
        price: 40.0,
        image: '/Images/melon.jpg',
        description: "Ripe & sweet with juicy, refreshing dessert alternative you'll crave."
      },
      {
        name: 'Black Grapes',
        price: 70.0,
        image: '/Images/grape.jpg',
        description: 'Crisp, juicy, sweet duo, plump, firm like popcorn and healthy too'
      },
      {
        name: 'Peach',
        price: 80.0,
        image: '/Images/peach.jpg',
        description: 'Juicy, sweet, and aromatic fruit that is perfect for desserts.'
      },
      {
        name: 'Plum',
        price: 75.0,
        image: '/Images/plum.jpg',
        description: 'Sweet, tart fruit with juicy flesh, perfect for snacking.'
      }
    ],
    veg: [
      {
        name: 'Tomato',
        price: 40.0,
        image: '/Images/tomato.jpg',
        description: 'Juicy and tangy, great for salads, curries or sauces.',
      },
      {
        name: 'Cauliflower',
        price: 60.0,
        image: '/Images/cauli.jpg',
        description: 'Mild and versatile, great for roasting or curries.',
      },
      {
        name: 'Onion',
        price: 35.0,
        image: '/Images/onion.jpg',
        description: 'Crisp, authentic, and pungent—adds depth to dishes.',
      },
      {
        name: 'Capsicum',
        price: 55.0,
        image: '/Images/caps.jpg',
        description: 'Sweet and crunchy, adds flavor and crunch to salads.',
      },
      {
        name: 'Carrot',
        price: 45.0,
        image: '/Images/carrot.jpg',
        description: 'Sweet and crunchy, excellent for salads or cooking.',
      },
      {
        name: 'Spinach',
        price: 25.0,
        image: '/Images/spinach.jpg',
        description: 'Fresh and nutritious, perfect for curries and healthy meals.',
      },
      {
        name: 'Potato',
        price: 30.0,
        image: '/Images/potato.jpg',
        description: 'Free from chemicals, ideal for health-conscious eating.',
      },
      {
        name: 'Broccoli',
        price: 75.0,
        image: '/Images/broc.jpg',
        description: 'Crisp and nutritious, perfect for stir-fries.',
      },
      {
        name: 'Cucumber',
        price: 35.0,
        image: '/Images/cucumber.jpg',
        description: 'Cool and refreshing, perfect for salads or snacking.',
      },
      {
        name: 'Brinjal',
        price: 40.0,
        image: '/Images/eggplant.jpg',
        description: 'Soft and smoky, perfect for making bharta and sambar.',
      },
      {
        name: 'Cabbage',
        price: 50.0,
        image: '/Images/cab.jpg',
        description: 'Crisp and mild, perfect for salads or stir-fries.',
      },
      {
        name: 'Coriender',
        price: 40.0,
        image: '/Images/coriender.jpg',
        description: 'Fresh, fragrant, and aromatic—perfect game changer.',
      },
      {
        name: 'Okra',
        price: 40.0,
        image: '/Images/lady.jpg',
        description: 'Tender and mild, ideal for stir-fries or curries.',
      },
      {
        name: 'Zucchini',
        price: 60.0,
        image: '/Images/zucchini.jpg',
        description: 'Mild flavor, perfect for sautéing or adding to pasta.'
      },
      {
        name: 'Pumpkin',
        price: 45.0,
        image: '/Images/pumpkin.jpg',
        description: 'Sweet and nutritious, great for soups, curries, or roasting.'
      },
    ],
    milk: [
      {
        name: 'Full Cream Milk',
        price: 45.0,
        image: '/Images/fullcream.jpg',
        description: 'Rich and creamy, perfect for coffee, tea, or desserts.',
      },
      {
        name: 'Low Fat Milk',
        price: 40.0,
        image: '/Images/lowfat.jpg',
        description: 'Healthy and nutritious, great for smoothies and cereals.',
      },
      {
        name: 'Chocolate Milk',
        price: 55.0,
        image: '/Images/chocolate.jpg',
        description: 'Sweet and indulgent, a favorite treat for kids and adults alike.',
      },
      {
        name: 'Skim Milk',
        price: 35.0,
        image: '/Images/skim.jpg',
        description: 'Light and refreshing, perfect for those who prefer low-fat options.',
      },
      {
        name: 'Buttermilk',
        price: 30.0,
        image: '/Images/buttermilk.jpg',
        description: 'Tangy and refreshing, ideal for making traditional Indian drinks and dishes.',
      },
      {
        name: 'Flavored Milk (Strawberry)',
        price: 50.0,
        image: '/Images/strawberrymilk.jpg',
        description: 'Deliciously sweet and fruity, perfect for a refreshing drink.',
      },
      {
        name: 'Almond Milk',
        price: 70.0,
        image: '/Images/almondmilk.jpg',
        description: 'Nutty and lactose-free, a great dairy alternative for vegans.',
      },
      {
        name: 'Soy Milk',
        price: 60.0,
        image: '/Images/soymilk.jpg',
        description: 'Rich in protein, a perfect alternative for those avoiding dairy.',
      },
      {
        name: 'A2 Milk',
        price: 75.0,
        image: '/Images/a2milk.jpg',
        description: 'Made from A2 cows, known for being easier on digestion.',
      },
      {
        name: 'Toned Milk',
        price: 40.0,
        image: '/Images/tonedmilk.jpg',
        description: 'Light and healthy, ideal for making tea or adding to smoothies.',
      },
      {
        name: 'Cow Milk',
        price: 50.0,
        image: '/Images/cowmilk.jpg',
        description: 'Fresh, pure, and rich in nutrients, perfect for all your dairy needs.',
      },
      {
        name: 'Goat Milk',
        price: 80.0,
        image: '/Images/goatmilk.jpg',
        description: 'A healthier alternative, rich in vitamins and minerals.',
      },
      {
        name: 'Organic Milk',
        price: 90.0,
        image: '/Images/organicmilk.jpg',
        description: 'Sourced from organic farms, free from pesticides and hormones.',
      },
      {
        name: 'Coconut Milk',
        price: 80.0,
        image: '/Images/coconutmilk.jpg',
        description: 'Natural, creamy, and great for making smoothies or curries.'
      },
      {
        name: 'Oat Milk',
        price: 65.0,
        image: '/Images/oatmilk.jpg',
        description: 'Smooth and creamy, a dairy-free alternative with a mild flavor.'
      },
    ],
    snacks: [
      {
        name: 'Potato Chips',
        price: 20.0,
        image: '/Images/chips.jpg',
        description: 'Crispy and salty, perfect for a quick snack or to pair with your favorite dip.',
      },
      {
        name: 'Chocolate Biscuit',
        price: 25.0,
        image: '/Images/chocolatebiscuit.jpg',
        description: 'Delicious chocolate-filled biscuits, perfect for tea time or as a sweet treat.',
      },
      {
        name: 'Savoury Popcorn',
        price: 15.0,
        image: '/Images/popcorn.jpg',
        description: 'Light and airy, seasoned with savory spices for a perfect snack while watching movies.',
      },
      {
        name: 'Namkeen',
        price: 30.0,
        image: '/Images/namkeen.jpg',
        description: 'A crunchy, spicy Indian snack, perfect to munch on during tea time.',
      },
      {
        name: 'Masala Peanuts',
        price: 35.0,
        image: '/Images/masalapeanuts.jpg',
        description: 'Roasted peanuts with a flavorful masala coating, a perfect blend of spicy and crunchy.',
      },
      {
        name: 'Cheese Crackers',
        price: 40.0,
        image: '/Images/cheesecrackers.jpg',
        description: 'Crunchy crackers with a cheesy flavor, perfect for pairing with a cup of tea.',
      },
      {
        name: 'Fruit Candy',
        price: 20.0,
        image: '/Images/fruitcandy.jpg',
        description: 'Sweet and tangy fruit-flavored candies, a fun treat for kids and adults alike.',
      },
      {
        name: 'Salted Pretzels',
        price: 45.0,
        image: '/Images/pretzels.jpg',
        description: 'Crunchy, salty pretzels, ideal for a quick snack on the go.',
      },
      {
        name: 'Granola Bars',
        price: 60.0,
        image: '/Images/granolabars.jpg',
        description: 'Healthy and filling, these granola bars are packed with nuts, seeds, and dried fruits.',
      },
      {
        name: 'Ice Cream Cone',
        price: 50.0,
        image: '/Images/icecreamcone.jpg',
        description: 'Crispy cone filled with creamy ice cream, a perfect treat to cool you down.',
      },
      {
        name: 'Fruit Jelly',
        price: 30.0,
        image: '/Images/fruitjelly.jpg',
        description: 'Sweet and refreshing fruit jelly, a colorful treat for all ages.',
      },
      {
        name: 'Samosa',
        price: 15.0,
        image: '/Images/samosa.jpg',
        description: 'Crispy, fried pastry filled with spiced potatoes and peas, a popular Indian snack.',
      },
      {
        name: 'Oatmeal Cookies',
        price: 35.0,
        image: '/Images/oatmealcookies.jpg',
        description: 'Chewy and hearty, made with wholesome oats and sweet raisins.'
      },
      {
        name: 'Rice Cakes',
        price: 20.0,
        image: '/Images/ricecakes.jpg',
        description: 'Light and crispy rice cakes, perfect for a low-calorie snack.'
      }
    ],
    chocolates: [
      {
        name: 'Dark Chocolate',
        price: 80.0,
        image: '/Images/darkchocolate.jpg',
        description: 'Rich, intense cocoa flavor with 70% cocoa content, perfect for dark chocolate lovers.',
      },
      {
        name: 'Milk Chocolate',
        price: 60.0,
        image: '/Images/milkchocolate.jpg',
        description: 'Smooth and creamy milk chocolate, a classic treat loved by all ages.',
      },
      {
        name: 'White Chocolate',
        price: 70.0,
        image: '/Images/whitechocolate.jpg',
        description: 'Sweet and creamy white chocolate, with a rich and velvety texture.',
      },
      {
        name: 'Chocolate Truffles',
        price: 120.0,
        image: '/Images/truffles.jpg',
        description: 'Luxurious and indulgent truffles with a rich chocolate filling.',
      },
      {
        name: 'Hazelnut Chocolate',
        price: 85.0,
        image: '/Images/hazelnutchocolate.jpg',
        description: 'Smooth milk chocolate with roasted hazelnuts, a perfect combination of creamy and crunchy.',
      },
      {
        name: 'Chocolate Almond Bar',
        price: 95.0,
        image: '/Images/chocolatealmond.jpg',
        description: 'Rich milk chocolate combined with crunchy almonds for a satisfying snack.',
      },
      {
        name: 'Mint Chocolate',
        price: 75.0,
        image: '/Images/mintchocolate.jpg',
        description: 'Refreshing mint combined with rich chocolate, perfect for those who love a minty twist.',
      },
      {
        name: 'Caramel Chocolate',
        price: 90.0,
        image: '/Images/caramelchocolate.jpg',
        description: 'Smooth chocolate with a creamy caramel filling, a deliciously sweet combination.',
      },
      {
        name: 'Chocolate Fudge',
        price: 110.0,
        image: '/Images/chocolatefudge.jpg',
        description: 'Dense, rich chocolate fudge with a melt-in-your-mouth texture, ideal for chocolate lovers.',
      },
      {
        name: 'Chocolate Strawberry',
        price: 95.0,
        image: '/Images/chocolatecoveredstrawberry.jpg',
        description: 'Fresh strawberries dipped in rich chocolate,perfect blend of fruity ',
      },
      {
        name: 'Milk Chocolate with Nuts',
        price: 80.0,
        image: '/Images/chocolatenuts.jpg',
        description: 'Creamy milk chocolate with a delightful crunch of assorted nuts, perfect for snacking.',
      },
      {
        name: 'Chocolate Mousse Cake',
        price: 150.0,
        image: '/Images/chocolatemousse.jpg',
        description: 'A rich and creamy chocolate mousse cake, perfect for special occasions or a sweet treat.',
      },
      {
        name: 'Chocolate Covered Pretzels',
        price: 65.0,
        image: '/Images/chocolatepretzels.jpg',
        description: 'Salty pretzels dipped in rich chocolate, an irresistible sweet and salty combination.',
      },
      {
        name: 'Chocolate Ganache',
        price: 140.0,
        image: '/Images/ganache.jpg',
        description: 'Rich chocolate ganache, perfect for desserts and cakes.'
      },
    ]
  },
  reducers: {
    // Future reducers can be added here
  }
});


const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    AddToCart: (state, inputItem) => {
      const item = state.find(item => item.name === inputItem.payload.name);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ ...inputItem.payload, quantity: 1 });
      }
    },
    IncrCart: (state, inputItem) => {
      const item = state.find(item => item.name === inputItem.payload.name);
      if (item) {
        item.quantity += 1;
      }
    },
    DecrCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return state.filter(i => i.name !== action.payload.name);
      }
    },
    RemoveFromCart: (state, action) => {
      return state.filter(i => i.name !== action.payload.name);
    },
    clearCart: () => [],
  }
});

export let { AddToCart, IncrCart, DecrCart, RemoveFromCart, clearCart } = cartSlice.actions;

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    AddToWishlist: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (!item) {
        state.push(action.payload);
      }
    },
    RemoveFromWishlist: (state, action) => {
      return state.filter(i => i.name !== action.payload.name);
    },
    clearWishlist: () => [],
  }
});

export let { AddToWishlist, RemoveFromWishlist, clearWishlist } = wishlistSlice.actions;

const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    wishlist: wishlistSlice.reducer,
  },
});

export default store;