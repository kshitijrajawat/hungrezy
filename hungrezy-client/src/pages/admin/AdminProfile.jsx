import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiGrid, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/api";

export default function AdminProfile() {
  const { auth } = useAuth();
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    API.get("/product/product-count")
      .then((r) => setStats((s) => ({ ...s, products: r.data.total || 0 })))
      .catch(console.error);

    API.get("/category/get-category")
      .then((r) => {
        const list = r.data.category ?? r.data ?? [];
        setStats((s) => ({ ...s, categories: Array.isArray(list) ? list.length : 0 }));
      })
      .catch(console.error);

    API.get("/auth/all-orders")
      .then((r) => {
        const list = r.data.orders || [];
        setStats((s) => ({ ...s, orders: list.length }));
        setRecentOrders(list.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  const tiles = [
    { label: "Total Products", value: stats.products,   icon: FiShoppingBag, to: "/admin/products",   color: "text-brand-400 bg-brand-500/10 border-brand-500/20" },
    { label: "Categories",     value: stats.categories, icon: FiGrid,        to: "/admin/categories", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "Total Orders",   value: stats.orders,     icon: FiPackage,     to: "/admin/orders",     color: "text-green-400 bg-green-500/10 border-green-500/20" },
  ];

  const statusColor = {
    "Not Process": "text-yellow-400 bg-yellow-500/10",
    "Processing":  "text-blue-400 bg-blue-500/10",
    "Shipped":     "text-purple-400 bg-purple-500/10",
    "deliverd":    "text-green-400 bg-green-500/10",
    "cancel":      "text-red-400 bg-red-500/10",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-2">Welcome back</p>
        <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Logged in as <span className="text-white">{auth?.user?.name}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {tiles.map(({ label, value, icon: Icon, to, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={to} className="card p-6 flex items-center gap-4 hover:border-brand-500/40 block">
              <div className={`p-3 rounded-xl border ${color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <FiTrendingUp size={16} className="text-brand-400" /> Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between bg-muted rounded-xl p-3">
                  <div>
                    <p className="text-xs font-mono text-gray-400 mb-1">{order.id?.slice(0, 16)}...</p>
                    <p className="text-xs text-gray-500">
                      {order.buyer?.name} · {order.products?.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      ₹{order.products?.reduce((s, p) => s + p.price, 0).toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[order.status] || "text-gray-400 bg-gray-500/10"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: "/admin/products",   label: "Manage Products",   icon: FiShoppingBag },
              { to: "/admin/categories", label: "Manage Categories", icon: FiGrid },
              { to: "/admin/orders",     label: "Manage Orders",     icon: FiPackage },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <Icon size={16} className="text-brand-400" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}