import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import API from "../../utils/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => API.get("/category/get-category").then(r => setCategories(r.data.category || []));

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      if (editId) {
        await API.put(`/category/update-category/${editId}`, { name });
        toast.success("Category updated!");
        setEditId(null);
      } else {
        await API.post("/category/create-category", { name });
        toast.success("Category created!");
      }
      setName(""); load();
    } catch (e) { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await API.delete(`/category/delete-category/${id}`);
    toast.success("Deleted!"); load();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">Categories</h1>

      {/* Form */}
      <div className="card p-5 mb-8">
        <h2 className="font-semibold mb-4">{editId ? "Edit Category" : "Add New Category"}</h2>
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="input flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          {editId && (
            <button onClick={() => { setEditId(null); setName(""); }}
              className="p-3 bg-muted hover:bg-white/10 rounded-xl text-gray-400 transition-colors">
              <FiX />
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-5">
            {editId ? <FiCheck /> : <FiPlus />}
            {saving ? "Saving..." : editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-white font-medium">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">/{cat.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(cat.id); setName(cat.name); }}
                className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors">
                <FiEdit2 size={14} />
              </button>
              <button onClick={() => handleDelete(cat.id)}
                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                <FiTrash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
