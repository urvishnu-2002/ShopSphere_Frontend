import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './Store.js'
import "./index.css";
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// ─── One-time startup cleanup ─────────────────────────────────────────────────
// Removes any stale 'selectedAddress' that may have been left from a previous
// user's session. This is the root cause of addresses like "subham" appearing
// for a different user. Runs silently every time the app starts.
(function cleanupStaleData() {
  try {
    // Always clear pending selectedAddress on app start — user must re-select each session
    localStorage.removeItem('selectedAddress');

    // Remove cart keys that don't belong to the current logged-in user
    const storedUser = localStorage.getItem('user');
    const currentEmail = storedUser ? JSON.parse(storedUser).email : null;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cart_') && currentEmail && key !== `cart_${currentEmail}`) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    // Silently ignore any errors
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="110938740-5btvhn5022u2l6pi7l9obt4gfudduo1i.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
