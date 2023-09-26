import Login from "./pages/login";
import ProdutoPage from "./pages/produtos";
import Home from "./pages/home";
import Menu from "./components/menu";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Router() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/produtos" element={<ProdutoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
