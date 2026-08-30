"use client";
import "../../app/(home)/home.css";
import Link from "next/link";
import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { CartContext } from "@/context/CartContext";

function ProductCard(props) {
  const bestSellers = props.items;
  const { addToCart } = useContext(CartContext);

  const Products = bestSellers.map((product) => (
    <div className="product-card" key={product.id}>
      <Link href={`/productdetail/${product.id}`}>
        <img src={product.image} alt="Product Image" />
      </Link>
      <h3>{product.title}</h3>
      <p className="price">₦{product.price.toLocaleString()}</p>
      <div className="ratings">
        {[...Array(product.rating)].map((_rating, i) => (
          <FaStar key={i} />
        ))}
      </div>
      <p>{product.tagline}</p>
      <button onClick={() => addToCart(product)}>Add to cart</button>
    </div>
  ));

  return <>{Products}</>;
}

export default ProductCard;
