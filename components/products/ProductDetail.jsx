"use client";
import { useState, useMemo, useContext } from "react";
import { useParams } from "next/navigation";
import "../../app/productdetail/[id]/productdetail.css";
import { FaPlus, FaTimes, FaStar } from "react-icons/fa";
import products from "../../data/products";
import PageNotFound from "./PageNotFound";
import { CartContext } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

function ProductDetail() {
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const [isDisplayedIng, setIsDisplayedIng] = useState(false);
  const [isDisplayedSto, setIsDisplayedSto] = useState(false);
  const [isDisplayedDel, setIsDisplayedDel] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const productId = params.id;

  const product = products.find((item) => item.id === Number(params.id));

  // Hooks must run on every render, so this useMemo sits ABOVE the
  // "product not found" early return below.
  const recommendedProducts = useMemo(() => {
    const otherProducts = products.filter(
      (item) => item.id !== Number(productId)
    );

    const shuffled = [...otherProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 3);
  }, [productId]);

  if (!product) {
    return <PageNotFound />;
  }

  function decreaseQuantity() {
    const decreasedQty = quantity - 1;

    if (decreasedQty <= 0) {
      setQuantity(1);
    } else {
      setQuantity(decreasedQty);
    }
  }

  function increaseQuantity() {
    const increasedQty = quantity + 1;
    setQuantity(increasedQty);
  }

  // One handler for every "Add to cart" button on this page, so the toast
  // always names the product that was actually added.
  function handleAddToCart(item) {
    addToCart(item);
    showToast(`Added ${item.title} to Cart`);
  }

  return (
    <div>
      <section className="productdetail-container">
        <div className="crumb">
          <Link href="/">Home</Link> /<Link href="/products">Products</Link> /
          <span>{product.title}</span>
        </div>

        <div className="productdetail-subcon">
          <div className="product-container">
            <div className="product-img">
              <img src={product.image} alt="Product Image" />
            </div>

            <div className="product-info">
              <p className="product-cat">{product.category}</p>
              <h1>{product.title}</h1>
              <p className="product-tagline">{product.tagline}</p>
              <div className="product-rating">
                {" "}
                {[...Array(product.rating)].map((_rating, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <div className="price-row">
                <span className="price">₦{product.price.toLocaleString()}</span>
                <span className="quantity">{product.quantity}</span>
              </div>
              <p className="product-description">{product.description}</p>

              <ul className="why">
                {product.why.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ul>
              <div className="buy-row">
                <div className="product-Qty">
                  <button
                    className="decrease"
                    onClick={() => decreaseQuantity()}
                  >
                    -
                  </button>
                  <span className="Qty">{quantity}</span>
                  <button
                    className="increase"
                    onClick={() => {
                      increaseQuantity();
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  className="addtocart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add To Cart
                </button>
                <button className="buynow-btn">Buy Now</button>
              </div>
              <div className="stock">
                <p>{product.availability}</p>
              </div>

              <div className="line"></div>

              <div className="accordion">
                <div className="acc-item">
                  <button className="acc-head">
                    Ingredients
                    <span className="icon">
                      {isDisplayedIng ? (
                        <FaTimes onClick={() => setIsDisplayedIng(false)} />
                      ) : (
                        <FaPlus onClick={() => setIsDisplayedIng(true)} />
                      )}
                    </span>
                  </button>

                  <div
                    className={isDisplayedIng ? "acc-body active" : "acc-body"}
                  >
                    <div className="acc-body-detail">{product.ingredients}</div>
                  </div>
                </div>
                <div className="line"></div>
                <div className="acc-item">
                  <button className="acc-head">
                    Storage & Shelf life
                    <span className="icon">
                      {isDisplayedSto ? (
                        <FaTimes onClick={() => setIsDisplayedSto(false)} />
                      ) : (
                        <FaPlus onClick={() => setIsDisplayedSto(true)} />
                      )}
                    </span>
                  </button>

                  <div
                    className={isDisplayedSto ? "acc-body active" : "acc-body"}
                  >
                    <div className="acc-body-detail">
                      Keep refrigerated at all times. Best enjoyed within 5 days
                      of delivery. Do not refreeze.
                    </div>
                  </div>
                </div>
                <div className="line"></div>

                <div className="acc-item">
                  <button className="acc-head">
                    Delivery & Returns
                    <span className="icon">
                      {isDisplayedDel ? (
                        <FaTimes onClick={() => setIsDisplayedDel(false)} />
                      ) : (
                        <FaPlus onClick={() => setIsDisplayedDel(true)} />
                      )}
                    </span>
                  </button>

                  <div
                    className={isDisplayedDel ? "acc-body active" : "acc-body"}
                  >
                    <div className="acc-body-detail">
                      Same-day delivery within Warri for orders placed before
                      2pm. Chilled packaging included. Since this is a fresh
                      perishable product, returns aren't accepted once delivered
                      — reach out to us directly if anything arrives damaged.
                    </div>
                  </div>
                  <div className="line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="related">
          <h2>You Might Also Like</h2>
          <div className="related-products">
            {recommendedProducts.map((newproduct) => (
              <div key={newproduct.id} className="product-card">
                <Link href={`/productdetail/${newproduct.id}`}>
                  <img src={newproduct.image} alt="Product Image" />
                </Link>

                <h3>{newproduct.title}</h3>
                <p className="price">₦{newproduct.price}</p>
                <div className="card-rating ">
                  {" "}
                  {[...Array(newproduct.rating)].map((_rating, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p>{newproduct.tagline}</p>

                <button onClick={() => handleAddToCart(newproduct)}>
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
