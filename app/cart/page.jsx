"use client";

import "../cart/cart.css";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import CartBody from "../../components/cart/CartBody";
import CartEmpty from "../../components/cart/CartEmpty";

function CartPage() {
  const { cartItem } = useContext(CartContext);

  return (
    <div>
      <Navbar />
      <section className="cart-container">
        {cartItem.length === 0 ? <CartEmpty /> : <CartBody />}
      </section>
      <Footer />
    </div>
  );
}

export default CartPage;
