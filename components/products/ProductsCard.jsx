import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FaStar } from "react-icons/fa";
import "../../app/(home)/home.css";
import { CartContext } from "@/context/CartContext";
import { useToast } from "../../context/ToastContext";

function ProductsCard({ items }) {
  const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    function handleAddToCart(product) {
      addToCart(product);
      showToast(`Added ${product.title} to Cart`);
    }

  return (
    <>
      {items.map((product, index) => (
        <div className="product-card" key={product.id}>
          <div className="product-image">
            <Link
              href={`/productdetail/${product.id}`}
              aria-label={`View ${product.title}`}
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 4}
                className="product-card-img"
              />
            </Link>
          </div>

          <div className="product-card-content">
            <h3>{product.title}</h3>

            <p className="price">
              ₦{Number(product.price).toLocaleString("en-NG")}
            </p>

            <div
              className="ratings"
              aria-label={`${product.rating} out of 5 stars`}
            >
              {[...Array(product.rating)].map((_, i) => (
                <FaStar key={i} aria-hidden="true" />
              ))}
            </div>

            <p>{product.tagline}</p>

            <button type="button" onClick={() => handleAddToCart(product)}>
              Add to cart
            </button>
          </div>

        </div>
      ))}
    </>
  );
}

export default ProductsCard;
