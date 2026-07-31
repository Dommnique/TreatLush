import { FaStar } from "react-icons/fa";

function ProductCard(props) {
  const bestSellers = props.items;

  const Products = bestSellers.map((product) => (
    <div className="product-card" key={product.id}>
      <img src={product.image} alt="Product Image" />
      <h3>{product.title}</h3>
      <p className="price">₦{product.price}</p>
      <div className="ratings">
        {[...Array(product.rating)].map((_rating, i) => (
          <FaStar key={i} />
        ))}
      </div>
      <p>{product.description}</p>
      <button>Add to cart</button>
    </div>
  ));

  return <>{Products}</>;
}

export default ProductCard;
