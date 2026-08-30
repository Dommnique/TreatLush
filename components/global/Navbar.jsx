"use client";

import { HiMenu } from "react-icons/hi";
import { LuShoppingBasket } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { useState, useContext } from "react";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";

function Navbar() {
  const { cartItem } = useContext(CartContext);
  const [isOpen, setisOpen] = useState(false);
  const totalItems = cartItem.reduce(
    (total, item) => total + item.cartQuantity,
    0
  );

  return (
    <div>
      <header>
        <nav>
          <h1 className="logo">
            <Link href="/">TreatLush.</Link>
          </h1>

          <ul>
            <li className="nav-links">
              <Link href="/">HOME</Link>
            </li>
            <li className="nav-links">
              <Link href="/about">ABOUT</Link>
            </li>
            <li className="nav-links">
              <Link href="/products">PRODUCTS</Link>
            </li>
            <li className="nav-links">
              <Link href="#contactus">CONTACT US</Link>
            </li>
          </ul>

          <Link href="/cart">
            <div className="cart-con">
              <LuShoppingBasket className="cart-icon" />
              <div className="cart-total">{totalItems}</div>
            </div>
          </Link>

          <div
            className="menu"
            onClick={() => {
              setisOpen(!isOpen);
            }}
          >
            <HiMenu className="icon" />
          </div>
        </nav>
        <div className={isOpen ? "side-bar isOpen" : "side-bar"} id="sideBar">
          <FaTimes
            className="icon"
            onClick={() => {
              setisOpen(!isOpen);
            }}
          />

          <ul>
            <li className="nav-links">
              <Link href="/">HOME</Link>
            </li>
            <li className="nav-links">
              <Link href="/about">ABOUT</Link>
            </li>
            <li className="nav-links">
              <Link href="/products">PRODUCTS</Link>
            </li>
            <li className="nav-links">
              <Link href="/contactus">CONTACT US</Link>
            </li>
            <li className="nav-links">
              <Link href="/cart">CART</Link>
            </li>
          </ul>
        </div>

        <div className={isOpen ? "full-overlay show" : "full-overlay"}></div>
      </header>
    </div>
  );
}

export default Navbar;
