import CheckoutForm from "../checkout/CheckoutForm";
import OrderSummary from "../checkout/OrderSummary";
import "../../app/checkout/checkout.css";
function CheckoutBody() {
  return (
    <div>
      <section className="checkout-container">
        <CheckoutForm />
      </section>
    </div>
  );
}

export default CheckoutBody;
