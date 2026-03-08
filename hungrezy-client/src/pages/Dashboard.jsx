import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser, FiMail, FiPhone, FiMapPin,
  FiPackage, FiShoppingBag, FiClock, FiCheckCircle
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../utils/api";
import Spinner from "../components/Spinner";

const statusColor = {
  "Not Process": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "Processing":  "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Shipped":     "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "deliverd":    "bg-green-500/10 text-green-400 border-green-500/30",
  "cancel":      "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function Dashboard() {
  const { auth } = useAuth();
  const { cart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const user = auth?.user;
  const delivered = orders.filter(o => o.status === "deliverd").length;
  const pending = orders.filter(o => o.status === "Not Process" || o.status === "Processing").length;

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-2">Welcome back</p>
        <h1 className="text-4xl font-display font-bold">{user?.name}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left — Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center">
                <FiUser size={28} className="text-brand-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-lg">{user?.name}</h2>
                <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                  {user?.role === 1 ? "Admin" : "Customer"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={14} className="text-gray-600 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FiPhone size={14} className="text-gray-600 shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.address && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <FiMapPin size={14} className="text-gray-600 shrink-0" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="card p-4 space-y-1">
            <Link to="/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <FiShoppingBag size={15} className="text-brand-400" /> Browse Menu
            </Link>
            <Link to="/orders"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <FiPackage size={15} className="text-brand-400" /> All My Orders
            </Link>
            <Link to="/cart"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
              <FiShoppingBag size={15} className="text-brand-400" /> Cart ({cart.length} items)
            </Link>
          </div>
        </div>

        {/* Right — Stats + Recent Orders */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Orders", value: orders.length, icon: FiPackage, color: "text-brand-400" },
              { label: "Delivered",    value: delivered,     icon: FiCheckCircle, color: "text-green-400" },
              { label: "Pending",      value: pending,       icon: FiClock,       color: "text-yellow-400" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 text-center"
              >
                <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">Recent Orders</h3>
              <Link to="/orders" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                View all →
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FiPackage size={36} className="mx-auto mb-3 text-gray-700" />
                <p className="text-sm">No orders yet.</p>
                <Link to="/products" className="btn-primary mt-4 inline-block text-sm py-2">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-muted rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.products?.slice(0, 3).map((p) => (
                          <img
                            key={p.id}
                            src={p.photoUrl}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-cover border border-dark"
                            onError={(e) => { e.target.src = "https://placehold.co/32x32/0f0f0f/f97316?text=F"; }}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs text-white">{order.products?.length} item(s)</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">
                        ₹{order.products?.reduce((s, p) => s + p.price, 0).toFixed(2)}
                      </span>
                      <span className={`badge border text-xs ${statusColor[order.status] || "bg-gray-500/10 text-gray-400"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}