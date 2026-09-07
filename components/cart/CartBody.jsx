"use client";
import CartItem from "../../components/cart/CartItem";
import Link from "next/link";
import "../../app/cart/cart.css";
import { useState, useContext } from "react";
import { CartContext } from "@/context/CartContext";

function CartBody() {
  const { cartItem, clearCart, notification } = useContext(CartContext);
  const [removedFromCart, setRemovedFromCart] = useState(false);
  const totalItems = cartItem.reduce(
    (total, item) => total + item.cartQuantity,
    0
  );

  const totalPrice = cartItem.reduce(
    (total, item) => total + item.cartQuantity * item.price,
    0
  );

  const deliveryPrice = 3000;

  function closeRemoved() {
    setRemovedFromCart(false);
  }

  function showRemoved() {
    setRemovedFromCart(true);

    setTimeout(closeRemoved, 3000);
  }

  cartItem.map((item) => {
    return item;
  });

  return (
    <div>
      <div className="cart-header">
        <span className="step">Step 1 Of 2</span>
        <h1 className="your-cart">Your Cart</h1>
        <p className="item-count">{totalItems} item(s) in your cart</p>
      </div>
      <div className="cart-body">
        <div>
          <div className="col-head">
            <span>Product</span>
            <span className="quantity">Quantity</span>
            <span className="total-head">Total</span>
            <span></span>
          </div>

          <div>
            {cartItem.map((item) => (
              <CartItem key={item.id} item={item} showRemoved={showRemoved} />
            ))}
          </div>

          <div className="cart-actions">
            <Link href="/products" className="continue">
              ← Continue Shopping
            </Link>
            <button onClick={() => clearCart()} className="clear-cart">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h2 className="title">Order Summary</h2>
            <div className="subtotal">
              <span>Subtotal - {totalItems} item(s)</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="delivery">
              <span>Delivery</span>
              <span>₦{deliveryPrice.toLocaleString()}</span>
            </div>
            <div className="line"></div>
            <div className="total">
              <span>Total</span>
              <span>₦{(totalPrice + deliveryPrice).toLocaleString()}</span>
            </div>

            <Link href="/checkout">
              <button className="checkout-btn" id="checkoutBtn">
                Proceed to Checkout →
              </button>
            </Link>

            <div className="secure-note">
              Secure checkout · Fresh delivery guaranteed
            </div>
          </div>
        </div>
      </div>

      <div className={removedFromCart ? "toast show" : "toast"} id="toast">
        {notification}
      </div>
    </div>
  );
}

export default CartBody;
