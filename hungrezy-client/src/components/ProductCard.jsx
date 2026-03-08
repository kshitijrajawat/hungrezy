import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { addToCart, cart, updateQty } = useCart();
  const inCart = cart.find((p) => p.id === product.id);

const handleAdd = (e) => {
  e.preventDefault();
  if (product.quantity <= 0) return toast.error("Out of stock!");
  if (inCart) return toast.info("Already in cart");
  addToCart(product);
  toast.success(`${product.name} added to cart!`);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-muted">
        <img
          src={product.photoUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://placehold.co/400x300/1a1a1a/f97316?text=Food"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link to={`/product/${product.slug}`}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-brand-500 transition-colors">
            <FiEye size={16} />
          </Link>
          <button onClick={handleAdd}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-brand-500 transition-colors">
            <FiShoppingCart size={16} />
          </button>
        </div>
        {/* Category badge */}
        <span className="absolute top-3 left-3 badge bg-brand-500/20 text-brand-300 border border-brand-500/30">
          {product.category?.name}
        </span>

        {/* Out of stock badge — ADD THIS */}
        {product.quantity <= 0 && (
          <span className="absolute top-3 right-3 badge bg-red-500/20 text-red-400 border border-red-500/30">
            Out of Stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-white hover:text-brand-400 transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-brand-400 font-bold text-lg">₹{product.price}</span>
          {inCart ? (
            <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
              <button
                onClick={(e) => { e.preventDefault(); updateQty(product.id, (inCart.qty || 1) - 1); }}
                className="text-gray-400 hover:text-white w-5 text-center transition-colors"
              >−</button>
              <span className="text-white text-sm w-4 text-center">{inCart.qty || 1}</span>
              <button
                onClick={(e) => { e.preventDefault(); updateQty(product.id, (inCart.qty || 1) + 1); }}
                disabled={(inCart.qty || 1) >= product.quantity}
                className="text-gray-400 hover:text-white w-5 text-center transition-colors disabled:opacity-30"
              >+</button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.quantity <= 0}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl btn-primary py-2 text-sm"
            >
              <FiShoppingCart size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
