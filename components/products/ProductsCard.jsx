import { FaStar } from "react-icons/fa";
import "../../app/(home)/home.css";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

function ProductsCard(props) {
  const FinalProducts = props.items;
  const { addToCart } = useContext(CartContext);

  const products = FinalProducts.map((product) => (
    <div className="product-card" key={product.id}>
      <div className="product-image">
        <Link href={`/productdetail/${product.id}`}>
          <img src={product.image} alt="Product Image" />
        </Link>
      </div>

      <div className="product-card-content">
        <h3>{product.title}</h3>
        <p className="price">₦{product.price}</p>
        <div className="ratings">
          {[...Array(product.rating)].map((_rating, i) => (
            <FaStar key={i} />
          ))}
        </div>
        <p>{product.tagline}</p>
        <button onClick={() => addToCart(product)}>Add to cart</button>
      </div>
    </div>
  ));

  return <>{products}</>;
}

export default ProductsCard;
