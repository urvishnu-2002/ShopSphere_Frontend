import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./Components/common/Navbar";
import Footer from "./Components/common/Footer";

function Layout() {
  const location = useLocation();
  const hideNavbarFooter = ["/", "/vendor", "/delivery", "/login", "/verifyGST", "/verifyPAN", "/store-name", "/shipping-address", "/shipping-method", "/shipping-fee-preferences", "/bank-details"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && <Navbar/>}
      <main className={`flex-grow ${!hideNavbarFooter ? "pt-24" : ""}`}>
        <AppRoutes />
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;

