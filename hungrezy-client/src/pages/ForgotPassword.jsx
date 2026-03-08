import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", answer: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", form);
      if (data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch { toast.error("Failed. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Reset Password</h1>
          <p className="text-gray-500">Answer your security question to reset</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" placeholder="Email Address"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input" />
            <input name="answer" type="text" placeholder="Security Answer"
              value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required className="input" />
            <input name="newPassword" type="password" placeholder="New Password"
              value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required className="input" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
