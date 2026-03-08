import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-brand-500">Hungrezy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
            <Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm">Menu</Link>
            <Link to="/categories" className="text-gray-400 hover:text-white transition-colors text-sm">Categories</Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <FiShoppingCart size={20} />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cart.length}
                </motion.span>
              )}
            </Link>

            {/* User menu — opens on hover, closes on mouse leave */}
            {auth?.token ? (
              <div
                className="relative"
                onMouseEnter={() => setDropOpen(true)}
                onMouseLeave={() => setDropOpen(false)}
              >
                <button className="flex items-center gap-2 bg-muted hover:bg-white/10 px-4 py-2 rounded-xl transition-colors">
                  <FiUser size={16} className="text-brand-400" />
                  <span className="text-sm text-gray-300">{auth.user?.name}</span>
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      <Link to={auth.user?.role === 1 ? "/admin/profile" : "/dashboard"} onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiGrid size={14} /> Profile
                      </Link>
                      <Link to={auth.user?.role === 1 ? "/admin/orders" : "/orders"} onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <FiGrid size={14} /> My Orders
                      </Link>

                      {auth.user?.role === 1 && (
                        <Link to="/admin" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-brand-400 hover:bg-white/5 transition-colors">
                          <FiGrid size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/5 bg-surface overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white py-2">Home</Link>
              <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white py-2">Menu</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white py-2">Cart ({cart.length})</Link>
              {auth?.token ? (
                <>
                  <Link to={auth.user?.role === 1 ? "/admin" : "/dashboard"} onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white py-2">Profile</Link>
                  {auth.user?.role === 1 && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-brand-400 py-2">Admin</Link>}
                  <button onClick={handleLogout} className="text-red-400 text-left py-2">Logout</button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}