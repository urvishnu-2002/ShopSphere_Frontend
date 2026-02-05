import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function Layout() {
  const location = useLocation();
  const hideNavbarFooter = ["/vendor", "/delivery", "/login"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && <Navbar />}
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