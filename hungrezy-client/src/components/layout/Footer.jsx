import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-display font-bold text-brand-500 mb-3">Hungrezy</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium food delivered to your doorstep. Fresh ingredients, bold flavors, fast delivery.
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-brand-400 transition-colors">Menu</Link></li>
            <li><Link to="/cart" className="hover:text-brand-400 transition-colors">Cart</Link></li>
            <li><Link to="/login" className="hover:text-brand-400 transition-colors">Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
              <a key={i} href="#" className="p-2 bg-muted rounded-lg text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Hungrezy. All rights reserved.
      </div>
    </footer>
  );
}
