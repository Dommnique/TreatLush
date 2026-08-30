"use client";
import "../../app/cart/cart.css";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

function CartItem(props) {
  const { removeItem, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);
  const item = props.item;
  const showRemoved = props.showRemoved;
  return (
    <div>
      <div className="product-list">
        <div className="cartitem-main">
          <div className="cartitem-img">
            <img src={item.image} alt="Product Image" />
          </div>

          <div className="cartitem-info">
            <span>{item.category}</span>
            <h4>{item.title}</h4>
            <p>₦{item.price.toLocaleString()} each</p>
            <button
              onClick={() => {
                removeItem(item);
                showRemoved();
              }}
            >
              Remove
            </button>
          </div>
        </div>
        <div className="buy-row">
          <div className="product-Qty">
            <button onClick={() => decreaseQuantity(item)} className="decrease">
              -
            </button>
            <span>{item.cartQuantity}</span>
            <button onClick={() => increaseQuantity(item)} className="increase">
              +
            </button>
          </div>
        </div>

        <span className="cartitem-price">
          <strong>₦{(item.price * item.cartQuantity).toLocaleString()}</strong>
        </span>

        <button
          onClick={() => removeItem(item)}
          className="item-remove-x"
          data-id="1"
          aria-label="Remove item"
        >
          ×
        </button>
      </div>
    </div>
  );
}
export default CartItem;
