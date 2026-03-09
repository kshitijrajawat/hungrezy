import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShoppingBag, FiArrowRight, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";
import DropIn from "braintree-web-drop-in-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Cart() {
  const { cart, removeFromCart, clearCart, total, updateQty } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [recommended, setRecommended] = useState([]);

useEffect(() => {
  if (cart.length === 0) { setRecommended([]); return; }
  const last = cart[cart.length - 1];
  if (last?.id && last?.category?.id) {
    API.get(`/product/related-product/${last.id}/${last.category.id}`)
      .then((r) => {
        const cartIds = cart.map((c) => c.id);
        const filtered = (r.data.products || []).filter((p) => !cartIds.includes(p.id));
        setRecommended(filtered);
      })
      .catch(() => setRecommended([]));
  }
}, [cart]);

  const getToken = async () => {
    if (!auth?.token) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    try {
      const { data } = await API.get("/product/braintree/token");
      setClientToken(data.clientToken);
      setShowPayment(true);
    } catch (e) {
      toast.error("Failed to load payment. Try again.");
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await API.post("/product/braintree/payment", {
        nonce,
        cart,
      });
      if (data.ok) {
        clearCart();
        toast.success("Order placed successfully! 🎉");
        navigate("/orders");
      }
    } catch (e) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <FiShoppingBag size={64} className="text-gray-700 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary">Browse Menu</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="card p-4 flex items-center gap-4"
              >
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-muted"
                  onError={(e) => { e.target.src = "https://placehold.co/80x80/1a1a1a/f97316?text=F"; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.category?.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-brand-400 font-bold">₹{(item.price * (item.qty || 1)).toFixed(2)}</p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                        className="text-gray-400 hover:text-white w-5 text-center transition-colors"
                      >−</button>
                      <span className="text-white text-sm w-4 text-center">{item.qty || 1}</span>
                      <button
                        onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                        disabled={(item.qty || 1) >= item.quantity}
                        className="text-gray-400 hover:text-white w-5 text-center transition-colors disabled:opacity-30"
                      >+</button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { removeFromCart(item.id); toast.info("Item removed"); }}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <FiTrash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-lg mb-6">Order Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Delivery</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white">
              <span>Total</span>
              <span className="text-brand-400 text-xl">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Braintree Drop-In UI */}
          {showPayment && clientToken && (
            <div className="mb-4">
              <DropIn
                options={{ authorization: clientToken }}
                onInstance={(i) => setInstance(i)}
              />
            </div>
          )}

          {/* Buttons */}
          {!showPayment ? (
            <button
              onClick={getToken}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiCreditCard /> Proceed to Pay
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading || !instance}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : (<>Pay ₹{total.toFixed(2)} <FiArrowRight /></>)}
            </button>
          )}

          <Link
            to="/products"
            className="block text-center text-sm text-gray-500 hover:text-gray-300 mt-4 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
