import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiClock, FiTruck } from "react-icons/fi";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const features = [
  { icon: FiStar,  label: "Premium Quality",   desc: "Handpicked ingredients" },
  { icon: FiClock, label: "30 Min Delivery",    desc: "Fresh & fast" },
  { icon: FiTruck, label: "Free Shipping",      desc: "On orders above ₹299" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/product/get-product")
      .then((res) => setProducts(res.data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-700/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/30 mb-6 text-sm px-3 py-1">
              🔥 Free delivery this week
            </span>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
              Delicious Food,{" "}
              <span className="text-brand-500 relative">
                Delivered
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10 Q75 2 150 8 Q225 14 298 6" stroke="#f97316" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </span>{" "}
              Fast.
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
              From local favourites to international cuisines — fresh, hot, and at your doorstep in 30 minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center gap-2 text-base">
                Explore Menu <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-outline flex items-center gap-2 text-base">
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 gap-4"
          >
            {features.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card p-5 flex items-center gap-4"
              >
                <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20">
                  <Icon className="text-brand-400" size={22} />
                </div>
                <div>
                  <p className="text-white font-semibold">{label}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1 uppercase tracking-wider">Fresh & Hot</p>
            <h2 className="text-3xl font-display font-bold">Featured Items</h2>
          </div>
          <Link to="/products" className="text-brand-400 hover:text-brand-300 flex items-center gap-1 text-sm transition-colors">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
