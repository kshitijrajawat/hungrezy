import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../../utils/api";
import Spinner from "../../components/Spinner";

const STATUSES = ["Not Process", "Processing", "Shipped", "deliverd", "cancel"];

const statusColor = {
  "Not Process": "text-yellow-400",
  "Processing":  "text-blue-400",
  "Shipped":     "text-purple-400",
  "deliverd":    "text-green-400",
  "cancel":      "text-red-400",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    API.get("/auth/all-orders")
      .then(r => setOrders(r.data.orders || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/auth/order-status/${orderId}`, { status });
      toast.success("Status updated!");
      load();
    } catch (e) { toast.error("Failed to update"); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center py-20 text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono text-sm text-gray-300">{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Buyer: <span className="text-gray-300">{order.buyer?.name || "Unknown"}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${statusColor[order.status]}`}>{order.status}</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="bg-muted border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.products?.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                    <img src={p.photoUrl} alt={p.name}
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/32x32/0f0f0f/f97316?text=F"; }} />
                    <span className="text-xs text-gray-300">{p.name}</span>
                    <span className="text-xs text-brand-400">₹{p.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-sm text-gray-500">
                <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                <span className="text-white font-semibold">
                  Total: ₹{order.products?.reduce((s, p) => s + p.price, 0).toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
