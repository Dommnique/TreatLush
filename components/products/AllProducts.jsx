import ProductsCard from "./ProductsCard";
import Image from "next/image";
import Link from "next/link";
import { useState, useContext } from "react";
import { FaStar } from "react-icons/fa";
import "../../app/(home)/home.css";
import { CartContext } from "@/context/CartContext";

function AllProducts(props) {
    const [addedToCart, setAddedToCart] = useState(false);
    const {addToCart} = useContext(CartContext);

    function closeAdded() {
      setAddedToCart(false);
    }

    function showAdded() {
      setAddedToCart(true);

      setTimeout(closeAdded, 3000);
    }

  const items = props.items;


  return (
    <>
      <section className="allproducts-section">
        <div className="allProducts">
          <ProductsCard items={items}/>
        </div>
      </section>
    </>
  );
}

export default AllProducts;
