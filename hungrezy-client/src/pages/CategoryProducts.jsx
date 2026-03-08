import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function CategoryProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/product/product-category/${slug}`)
      .then((r) => {
        setProducts(r.data.products || []);
        setCategory(r.data.category);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/categories"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit">
        <FiArrowLeft size={16} /> Back to Categories
      </Link>

      <div className="mb-8">
        <p className="text-brand-400 text-sm font-medium uppercase tracking-wider mb-2">Category</p>
        <h1 className="text-4xl font-display font-bold">{category?.name || slug}</h1>
        <p className="text-gray-500 mt-1">{products.length} items found</p>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🍽️</p>
          <p>No products in this category yet.</p>
          <Link to="/products" className="btn-primary mt-6 inline-block">Browse All</Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </motion.div>
      )}
    </div>
  );
}
