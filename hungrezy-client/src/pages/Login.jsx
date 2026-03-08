import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate(data.user.role === 1 ? "/admin" : redirect);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue ordering</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" placeholder="Email Address"
              value={form.email} onChange={handleChange} required className="input" />
            <input name="password" type="password" placeholder="Password"
              value={form.password} onChange={handleChange} required className="input" />

            <div className="text-right">
              <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 text-sm transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            New here?{" "}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
