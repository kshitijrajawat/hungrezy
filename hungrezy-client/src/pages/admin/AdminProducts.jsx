import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import API, { DIRECT_API } from "../../utils/api";

const emptyForm = { name: "", description: "", price: "", category: "", quantity: "", shipping: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState(null);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([API.get("/product/get-product"), API.get("/category/get-category")])
      .then(([p, c]) => { setProducts(p.data.products || []); setCategories(c.data.category || []); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const openCreate = () => { setForm(emptyForm); setPhoto(null); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category?.id || "", quantity: p.quantity, shipping: p.shipping || false });
    setPhoto(null); setEditId(p.id); setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);

      if (editId) {
        await DIRECT_API.put(`/product/update-product/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product updated!");
      } else {
        await DIRECT_API.post("/product/create-product", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product created!");
      }
      setShowModal(false); load();
    } catch (e) { toast.error("Failed to save product"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await API.delete(`/product/delete-product/${id}`);
    toast.success("Deleted!"); load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Products</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus /> Add Product
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {["Photo", "Name", "Category", "Price", "Qty", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/5 hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <img src={p.photoUrl} alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg bg-muted"
                      onError={(e) => { e.target.src = "https://placehold.co/48x48/1a1a1a/f97316?text=F"; }} />
                  </td>
                  <td className="px-4 py-3 text-white font-medium max-w-[180px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-400">{p.category?.name}</td>
                  <td className="px-4 py-3 text-brand-400 font-semibold">₹{p.price}</td>
                  <td className="px-4 py-3 text-gray-400">{p.quantity}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">{editId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg"><FiX /></button>
            </div>
            <div className="space-y-3">
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="input" />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input h-24 resize-none" />
              <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} className="input" />
              <select name="category" value={form.category} onChange={handleChange} className="input">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="input" />
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" name="shipping" checked={form.shipping} onChange={handleChange} className="accent-brand-500 w-4 h-4" />
                Free Shipping
              </label>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Product Photo (max 1MB)</label>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
                  className="text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-500/20 file:text-brand-400 hover:file:bg-brand-500/30 file:cursor-pointer" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-outline flex-1 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 text-sm">
                {saving ? "Saving..." : editId ? "Update" : "Create"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
