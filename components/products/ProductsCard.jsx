import { FaStar } from "react-icons/fa";

function ProductsCard(props) {
  const FinalProducts = props.items;

  const products = FinalProducts.map((product) => (
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

  return <>{products}</>;
}

export default ProductsCard;
