"use client";
import { createContext, useContext, useReducer, useState } from "react";

const CartContext = createContext();
const initialState = [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, cartQuantity: 1 }];
    }

    case "REMOVE_ITEM": {
      return state.filter((item) => item.id !== action.payload.id);
    }

    case "INCREASE_QUANTITY": {
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      );
    }

    case "DECREASE_QUANTITY": {
      return state.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              cartQuantity: item.cartQuantity > 1 ? item.cartQuantity - 1 : 1,
            }
          : item
      );
    }

    case "CLEAR_CART": {
      return (state = []);
    }

    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [cartItem, dispatch] = useReducer(cartReducer, initialState);
  const [notification, setNotification] = useState(false);

  function addToCart(product) {
    dispatch({
      type: "ADD_ITEM",
      payload: product,
    });
  }

  function removeItem(product) {
    dispatch({
      type: "REMOVE_ITEM",
      payload: product,
    });

    setNotification(`${product.title} removed`);
  }

  function increaseQuantity(product) {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: product,
    });
  }

  function decreaseQuantity(product) {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: product,
    });
  }

  function clearCart() {
    dispatch({
      type: "CLEAR_CART",
    });
  }
  return (
    <CartContext.Provider
      value={{
        cartItem,
        addToCart,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProvider };
