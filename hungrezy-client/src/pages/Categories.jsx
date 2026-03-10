import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import API from "../utils/api";
import Spinner from "../components/Spinner";

const categoryEmojis = {
  "Pizza": "🍕",
  "North Indian": "🍛",
  "Beverages": "🥤",
  "Burger": "🍔",
  "Dessert": "🍰",
  "Pasta": "🍝",
  "Salad": "🥗",
  "Sandwich": "🥪"
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/category/get-category")
      .then((r) => setCategories(r.data.category || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-2">Browse By</p>
        <h1 className="text-4xl font-display font-bold">All Categories</h1>
      </div>

      {loading ? <Spinner /> : categories.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🍽️</p>
          <p>No categories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/product-category/${cat.slug}`}
                className="card p-6 flex flex-col items-center text-center gap-3 hover:border-brand-500/40 group"
              >
                <span className="text-5xl">{categoryEmojis[i % categoryEmojis.length]}</span>
                <h3 className="text-white font-semibold group-hover:text-brand-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-brand-400 transition-colors">
                  View items <FiArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
