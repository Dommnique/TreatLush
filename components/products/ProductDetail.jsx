"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import "../../app/productdetail/[id]/productdetail.css";
import { FaPlus, FaTimes, FaStar } from "react-icons/fa";
import products from "../../data/products";
import PageNotFound from "./PageNotFound";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Link from "next/link";

function ProductDetail() {
  const { addToCart } = useContext(CartContext);
  const [isDisplayedIng, setIsDisplayedIng] = useState(false);
  const [isDisplayedSto, setIsDisplayedSto] = useState(false);
  const [isDisplayedDel, setIsDisplayedDel] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const params = useParams();
  const productId = params.id;
  //console.log(params.id);

  const product = products.find((item) => item.id === Number(params.id));

  if (!product) {
    return <PageNotFound />;
  }

  const recommendedProducts = useMemo(() => {
    const otherProducts = products.filter(
      (product) => product.id !== Number(productId)
    );

    const shuttled = [...otherProducts];
    for (let i = shuttled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuttled[i], shuttled[j]] = [shuttled[j], shuttled[i]];
    }

    return shuttled.slice(0, 3);
  }, [products, productId]);

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

  function closeAdded() {
    setAddedToCart(false);
  }

  function showAdded() {
    setAddedToCart(true);

    setTimeout(closeAdded, 3000);
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
                  onClick={() => {
                    showAdded();
                    addToCart(product);
                  }}
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
            {recommendedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link href={`/productdetail/${product.id}`}>
                  <img src={product.image} alt="Product Image" />
                </Link>

                <h3>{product.title}</h3>
                <p className="price">₦{product.price}</p>
                <div className="card-rating ">
                  {" "}
                  {[...Array(product.rating)].map((_rating, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p>{product.tagline}</p>

                <button>Add to cart</button>
              </div>
            ))}
          </div>
        </div>

        <div className={addedToCart ? "toast show" : "toast"}>
          Added {product.title} to Cart
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
