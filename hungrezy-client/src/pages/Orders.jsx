import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";
import API from "../utils/api";
import Spinner from "../components/Spinner";

const statusIcon = {
  "Not Processed yet": <FiClock className="text-yellow-400" />,
  "Processing":  <FiPackage className="text-blue-400" />,
  "Shipped":     <FiTruck className="text-purple-400" />,
  "delivered":    <FiCheckCircle className="text-green-400" />,
  "cancel":      <FiXCircle className="text-red-400" />,
};

const statusColor = {
  "Not Process": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "Processing":  "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Shipped":     "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "delivered":    "bg-green-500/10 text-green-400 border-green-500/30",
  "cancel":      "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FiPackage size={48} className="mx-auto mb-4 text-gray-700" />
          <p>No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="text-sm font-mono text-gray-300">{order.id}</p>
                </div>
                <span className={`badge border ${statusColor[order.status] || "bg-gray-500/10 text-gray-400"}`}>
                  {statusIcon[order.status]} {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {order.products?.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-muted rounded-xl p-2">
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-dark"
                      onError={(e) => { e.target.src = "https://placehold.co/40x40/0f0f0f/f97316?text=F"; }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-white truncate">{p.name}</p>
                      <p className="text-xs text-brand-400">₹{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-sm text-gray-500">
                <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                <span className="text-white font-semibold">
                  ₹{order.products?.reduce((s, p) => s + p.price, 0).toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
