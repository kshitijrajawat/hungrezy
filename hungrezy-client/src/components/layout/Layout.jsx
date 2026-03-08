import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
