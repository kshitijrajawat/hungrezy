import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiGrid, FiShoppingBag, FiUsers } from "react-icons/fi";
import API from "../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });

  useEffect(() => {
    Promise.all([
      API.get("/product/product-count"),
      API.get("/category/get-category"),
      API.get("/auth/all-orders"),
    ]).then(([prod, cat, ord]) => {
      setStats({
        products: prod.data.total || 0,
        categories: cat.data.category?.length || 0,
        orders: ord.data.orders?.length || 0,
      });
    }).catch(console.error);
  }, []);

  const tiles = [
    { label: "Total Products",   value: stats.products,   icon: FiShoppingBag, to: "/admin/products",   color: "brand" },
    { label: "Categories",        value: stats.categories, icon: FiGrid,        to: "/admin/categories", color: "purple" },
    { label: "Total Orders",      value: stats.orders,     icon: FiPackage,     to: "/admin/orders",     color: "green" },
  ];

  const links = [
    { to: "/admin/products",   label: "Manage Products",   icon: FiShoppingBag },
    { to: "/admin/categories", label: "Manage Categories", icon: FiGrid },
    { to: "/admin/orders",     label: "Manage Orders",     icon: FiPackage },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {tiles.map(({ label, value, icon: Icon, to, color }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={to} className="card p-6 flex items-center gap-4 hover:border-brand-500/40 block">
              <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20">
                <Icon className="text-brand-400" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {links.map(({ to, label, icon: Icon }, i) => (
          <Link key={i} to={to}
            className="card p-5 flex items-center gap-3 hover:border-brand-500/40 transition-all">
            <Icon className="text-brand-400" size={20} />
            <span className="text-gray-300 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
