import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const PRICE_RANGES = [
  [0, 100], [100, 300], [300, 500], [500, 1000], [1000, 5000],
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [checkedCats, setCheckedCats] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtering, setFiltering] = useState(false);

  const perPage = 6;

  useEffect(() => {
    API.get("/category/get-category").then((r) => setCategories(r.data.category || []));
    API.get("/product/product-count").then((r) => setTotal(r.data.total || 0));
  }, []);

  useEffect(() => {
    if (!filtering && !search) loadPage(page);
  }, [page, filtering]);

  const loadPage = async (p) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/product/product-list/${p}?perPage=${perPage}`);
      setProducts(data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const applyFilters = async () => {
    setPage(1);
    if (checkedCats.length === 0 && priceRange.length === 0) {
      setFiltering(false);
      loadPage(1);
      return;
    }
    setFiltering(true);
    setLoading(true);
    try {
      const { data } = await API.post("/product/product-filters", {
        checked: checkedCats,
        radio: priceRange,
      });
      setProducts(data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = async (keyword) => {
    setPage(1);
    setSearch(keyword);
    if (!keyword.trim()) { loadPage(1); return; }
    try {
      const { data } = await API.get(`/product/search/${keyword}`);
      setProducts(data || []);
    } catch (e) { console.error(e); }
  };

  const resetFilters = () => {
    setCheckedCats([]);
    setPriceRange([]);
    setSearch("");
    setFiltering(false);
    loadPage(1);
  };

  const toggleCat = (id) => {
    setCheckedCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Our Menu</h1>
        <p className="text-gray-500">Explore {total} delicious items</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><FiFilter size={16} /> Filters</h3>
              {(checkedCats.length > 0 || priceRange.length > 0) && (
                <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <FiX size={12} /> Clear
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Category</p>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedCats.includes(cat.id)}
                      onChange={() => toggleCat(cat.id)}
                      className="accent-brand-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Price Range</p>
              <div className="space-y-2">
                {PRICE_RANGES.map(([min, max]) => (
                  <label key={`${min}-${max}`} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === min && priceRange[1] === max}
                      onChange={() => setPriceRange([min, max])}
                      className="accent-brand-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      ₹{min} – ₹{max}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={applyFilters} className="btn-primary w-full text-sm">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Search */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-11"
            />
          </div>

          {loading ? <Spinner /> : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🍽️</p>
              <p>No items found. Try different filters.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          )}

          {/* Pagination */}
          {!filtering && !search && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                    page === p ? "bg-brand-500 text-white" : "bg-muted text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
