import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/layout/Layout";
import { PrivateRoute, AdminRoute } from "./components/Routes";

import Home             from "./pages/Home";
import Products         from "./pages/Products";
import ProductDetail    from "./pages/ProductDetail";
import Categories       from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import ForgotPassword   from "./pages/ForgotPassword";
import Cart             from "./pages/Cart";
import Orders           from "./pages/Orders";
import Dashboard        from "./pages/Dashboard";

import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminProducts   from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders     from "./pages/admin/AdminOrders";
import AdminProfile    from "./pages/admin/AdminProfile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Public */}
              <Route path="/"                          element={<Home />} />
              <Route path="/products"                  element={<Products />} />
              <Route path="/product/:slug"             element={<ProductDetail />} />
              <Route path="/categories"                element={<Categories />} />
              <Route path="/product-category/:slug"    element={<CategoryProducts />} />
              <Route path="/login"                     element={<Login />} />
              <Route path="/register"                  element={<Register />} />
              <Route path="/forgot-password"           element={<ForgotPassword />} />

              {/* Protected */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/cart"   element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />

              {/* Admin */}
              <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products"   element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/orders"     element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/profile"     element={<AdminRoute><AdminProfile /></AdminRoute>} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
