import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Gifts from "@/pages/Gifts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/gifts" element={<Gifts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
