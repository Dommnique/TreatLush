"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { CheckoutSchema } from "./schema";


const defaultErrors = {
  fullName: null,
  email: null,
  phone: null,
  address: null,
  city: null,
  state: null,
  deliveryNote: null,
};

function CheckoutForm() {
  const { cartItem } = useContext(CartContext);
  const deliveryPrice = 3000;
  const totalItems = cartItem.reduce(
    (total, item) => total + item.cartQuantity,
    0
  );

  const [data, setData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    deliveryNote: ""
  })


  const [errors, setErrors] = useState(defaultErrors);

  const totalPrice = cartItem.reduce(
    (total, item) => total + item.cartQuantity * item.price,
    0
  );

  async function handleSubmit(e) {  
    e.preventDefault();

    
    setErrors(defaultErrors);
    const result = CheckoutSchema.safeParse(data)
    if (!result.success) {
      
      setErrors({
        ...defaultErrors,
        ...result.error.flatten().fieldErrors
      })
      //console.log(result.error.flatten().fieldErrors);
      return;
    }

    const response = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: result.data,
        cart: cartItem,
        total: totalPrice + deliveryPrice,
      }),
    });

    const resultFromApi = await response.json();

console.log("Initialization HTTP status:", response.status);
console.log("Paystack initialization response:", resultFromApi);

if (
  !response.ok ||
  !resultFromApi.status ||
  !resultFromApi.data?.authorization_url
) {
  console.error("Payment initialization failed:", resultFromApi.message);
  alert(resultFromApi.message || "Unable to start payment.");
  return;
}

console.log(
  "Callback URL configured on server:",
  process.env.NEXT_PUBLIC_SITE_URL
);
    window.location.href = resultFromApi.data.authorization_url;
  }

  return (
    <div>
      <div className="header-band">
        <Link className="back-link" href="/cart">
          ← Back to Cart
        </Link>
        <div className="header-eyebrow">Checkout</div>
        <h1 className="display">Delivery & Payment</h1>

        <div className="stepper">
          <div className="step done">
            <span className="dot">✓</span> Cart
          </div>
          <div className="step-sep"></div>
          <div className="step active">
            <span className="dot">2</span> Checkout
          </div>
          <div className="step-sep"></div>
          <div className="step">
            <span className="dot">3</span> Confirmation
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="form-card">
              <div className="header">
                <span className="dot">1</span>
                <h3>Contact Information</h3>
              </div>

              <div className="field-grid">
                <div className="field full">
                  <label>Full name</label> <br />
                  <input
                    value={data.fullName}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    type="text"
                    placeholder="e.g William Malachy"
                    aria-invalid={errors.fullName !== null}
                    required
                  />
                  {errors.fullName !== null ? (
                    <small>{errors.fullName?.[0]}</small>
                  ) : null}
                </div>

                <div className="field">
                  <label>Email Address</label> <br />
                  <input
                    value={data.email}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={errors.email !== null}
                    required
                  />
                  {errors.email !== null ? (
                    <small>{errors.email[0]}</small>
                  ) : null}
                </div>

                <div className="field">
                  <label>Phone Number</label> <br />
                  <input
                    value={data.phone}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    type="tel"
                    placeholder="080X XXX XXXX"
                    aria-invalid={errors.phone !== null}
                    required
                  />
                  {errors.phone !== null ? (
                    <small>{errors.phone[0]}</small>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="form-card">
              <div className="header">
                <span className="dot">2</span>
                <h3>Delivery Address</h3>
              </div>

              <div className="field-grid">
                <div className="field full">
                  <label>Street Address</label> <br />
                  <input
                    value={data.address}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    type="text"
                    placeholder="House number, street, area"
                    aria-invalid={errors.address !== null}
                    required
                  />
                  {errors.address !== null ? (
                    <small>{errors.address[0]}</small>
                  ) : null}
                </div>

                <div className="field">
                  <label>City</label> <br />
                  <input
                    value={data.city}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    type="text"
                    placeholder="e.g Abuja"
                    aria-invalid={errors.city !== null}
                    required
                  />
                  {errors.city !== null ? (
                    <small>{errors.city[0]}</small>
                  ) : null}
                </div>

                <div className="field">
                  <label>State</label> <br />
                  <select
                    name="state"
                    aria-invalid={errors.state !== null}
                    required
                    value={data.state}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, state: e.target.value }))
                    }
                  >
                    <option>Select state</option>
                    <option value="warri">Warri</option>
                    <option value="lagos">Lagos</option>
                    <option value="fct">FCT</option>
                    <option value="Rivers">Rivers</option>
                  </select>
                  {errors.state !== null ? (
                    <small>{errors.state[0]}</small>
                  ) : null}
                </div>

                <div className="field full">
                  <label>
                    Delivery Notes<span className="optional">(optional)</span>
                  </label>
                  <textarea
                    value={data.deliveryNote}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        deliveryNote: e.target.value,
                      }))
                    }
                    placeholder="e.g gate code, landmark, preferred time"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="summary">
            <h2>
              Order Summary
              <Link className="sum-link" href="/cart">
                Edit Cart
              </Link>
            </h2>
            <div className="mini-cartitems">
              {cartItem.map((item) => (
                <div key={item.id} className="mini-item-con">
                  <div className="mini-item">
                    <img src={item.image} alt={item.title} />
                    <div className="mi-info">
                      <div className="mi-name">{item.title}</div>
                      <div className="mi-qty">Qty {item.cartQuantity}</div>
                    </div>
                    <div className="mi-price">
                      <strong>₦{item.price.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sum-row">
              <span>
                Subtotal (<span id="itemCount">{totalItems}</span> items)
              </span>
              <span className="val">₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="sum-row">
              <span>Delivery</span>
              <span className="val">₦{deliveryPrice.toLocaleString()}</span>
            </div>
            <div className="sum-row total">
              <span>Total</span>
              <span className="val">
                <strong>
                  ₦{(totalPrice + deliveryPrice).toLocaleString()}
                </strong>
              </span>
            </div>

            <button type="submit" className="pay-btn">
              🔒 Pay Now
              <span className="amount">
                · ₦{(totalPrice + deliveryPrice).toLocaleString()}
              </span>
            </button>

            <div className="paystack-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#00C3F7"></rect>
                <path
                  d="M6 12.5l4 4 8-8.5"
                  stroke="#0A2540"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Secured by Paystack
            </div>
            <div className="secure-note">
              You'll be redirected to Paystack's secure checkout to complete
              payment.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;
