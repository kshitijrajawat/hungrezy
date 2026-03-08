import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const addToCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);
    if (exists) return;
    const updated = [...cart, { ...product, qty: 1 }];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter((p) => p.id !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((p) => p.id === productId ? { ...p, qty } : p);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const total = cart.reduce((sum, p) => sum + p.price * (p.qty || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQty, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
