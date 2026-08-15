import { FaStar } from "react-icons/fa";
import Link from "next/link";

function ProductsCard(props) {
  const FinalProducts = props.items;

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
        <button>Add to cart</button>
      </div>
    </div>
  ));

  return <>{products}</>;
}

export default ProductsCard;
