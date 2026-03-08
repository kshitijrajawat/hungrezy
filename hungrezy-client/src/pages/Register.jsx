import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "", answer: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      if (data.success) {
        toast.success("Registered successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(data.message || data.error);
      }
    } catch (err) {
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Create Account</h1>
          <p className="text-gray-500">Join Hungrezy and order delicious food</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name",     placeholder: "Full Name",         type: "text" },
              { name: "email",    placeholder: "Email Address",      type: "email" },
              { name: "password", placeholder: "Password (min 6)",   type: "password" },
              { name: "phone",    placeholder: "Phone Number",       type: "tel" },
              { name: "address",  placeholder: "Delivery Address",   type: "text" },
              { name: "answer",   placeholder: "Security Answer (e.g. favourite color)", type: "text" },
            ].map(({ name, placeholder, type }) => (
              <input
                key={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                required
                className="input"
              />
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
