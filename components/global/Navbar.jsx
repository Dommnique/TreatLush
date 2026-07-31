"use client";

import { HiMenu } from "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import { use, useState } from "react";
import Link from "next/link";

function Navbar() {
  const [isOpen, setisOpen] = useState(false);

  return (
    <>
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
              <a href="/products">PRODUCTS</a>
            </li>
            <li className="nav-links">
              <a href="#contactus">CONTACT US</a>
            </li>
            <li className="nav-links">
              <a href="#cart">CART</a>
            </li>
          </ul>

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
              <a href="#home">HOME</a>
            </li>
            <li className="nav-links">
              <a href="#about">ABOUT</a>
            </li>
            <li className="nav-links">
              <a href="#products">PRODUCTS</a>
            </li>
            <li className="nav-links">
              <a href="#contactus">CONTACT US</a>
            </li>
            <li className="nav-links">
              <a href="#cart">CART</a>
            </li>
          </ul>
        </div>

        <div className={isOpen ? "full-overlay show" : "full-overlay"}></div>
      </header>
    </>
  );
}

export default Navbar;
