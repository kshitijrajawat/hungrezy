import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiTag } from "react-icons/fi";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, cart, updateQty } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    API.get(`/product/get-product/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);

        if (data.product?.id && data.product?.category?.id) {
          API.get(
            `/product/related-product/${data.product.id}/${data.product.category.id}`
          ).then((r) => setRelated(r.data.products || []));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;

  if (!product) {
    return (
      <p className="text-center py-20 text-gray-500">
        Product not found.
      </p>
    );
  }

  const inCart = cart.find((p) => p.id === product.id);

  const handleAdd = () => {
    if (inCart) {
      return toast.info("Already in cart");
    }

    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-12 items-start"
      >
        {/* Image */}
        <div className="card overflow-hidden">
          <img
            src={product.photoUrl}
            alt={product.name}
            className="w-full h-80 object-cover"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/600x400/1a1a1a/f97316?text=Food";
            }}
          />
        </div>

        {/* Details */}
        <div>
          <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/30 mb-4">
            <FiTag size={12} /> {product.category?.name}
          </span>

          <h1 className="text-4xl font-display font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-gray-400 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <span className="text-4xl font-bold text-brand-400">
              ₹{product.price}
            </span>

            <span
              className={`badge ${
                product.quantity > 0
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              } border`}
            >
              {product.quantity > 0
                ? `${product.quantity} in stock`
                : "Out of stock"}
            </span>
          </div>

          {inCart ? (
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 w-fit">
              <button
                onClick={() =>
                  updateQty(product.id, (inCart.qty || 1) - 1)
                }
                className="text-gray-400 hover:text-white w-6 text-center text-xl transition-colors"
              >
                −
              </button>

              <span className="text-white font-semibold w-6 text-center">
                {inCart.qty || 1}
              </span>

              <button
                onClick={() =>
                  updateQty(product.id, (inCart.qty || 1) + 1)
                }
                disabled={(inCart.qty || 1) >= product.quantity}
                className="text-gray-400 hover:text-white w-6 text-center text-xl transition-colors disabled:opacity-30"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={product.quantity === 0}
              className="flex items-center gap-2 btn-primary"
            >
              <FiShoppingCart />
              {product.quantity === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-display font-bold mb-6">
            You might also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
