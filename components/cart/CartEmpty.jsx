import Link from "next/link";

function CartEmpty() {
  return (
    <div>
      <section className="empty-cart">
        <div className="icon">
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Empty shopping cart"
          >
            {/* Soft background circle */}
            <circle cx="110" cy="105" r="82" fill="#F1F8F0" />

            {/* Sparkle */}
            <path
              d="M54 74C55.5 79 59 82.5 64 84C59 85.5 55.5 89 54 94C52.5 89 49 85.5 44 84C49 82.5 52.5 79 54 74Z"
              fill="#78B77D"
            />

            {/* Shopping cart handle */}
            <path
              d="M55 91H70L77 125"
              stroke="#579A61"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Cart basket */}
            <path
              d="M70 91H169L157 143C155.8 148 151.4 151.5 146.2 151.5H84"
              fill="#EAF5E8"
              stroke="#579A61"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* Cart basket lines */}
            <path
              d="M82 108H164"
              stroke="#78B77D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M78 126H160"
              stroke="#78B77D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M93 93L99 150"
              stroke="#78B77D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M121 93L123 150"
              stroke="#78B77D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <path
              d="M148 93L143 150"
              stroke="#78B77D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cart base */}
            <path
              d="M84 151H148"
              stroke="#579A61"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Left wheel */}
            <circle
              cx="92"
              cy="166"
              r="9"
              fill="#FFFFFF"
              stroke="#579A61"
              strokeWidth="5"
            />

            {/* Right wheel */}
            <circle
              cx="143"
              cy="166"
              r="9"
              fill="#FFFFFF"
              stroke="#579A61"
              strokeWidth="5"
            />

            {/* Heart */}
            <path
              d="M157 53
       C157 47 164 44 168 49
       C172 44 179 47 179 53
       C179 60 168 67 168 67
       C168 67 157 60 157 53Z"
              fill="#78B77D"
            />

            {/* Small sparkle */}
            <path
              d="M184 78C185 81 187 83 190 84C187 85 185 87 184 90C183 87 181 85 178 84C181 83 183 81 184 78Z"
              fill="#78B77D"
            />

            {/* Decorative dotted curve */}
            <path
              d="M139 75C129 64 139 51 149 57"
              stroke="#78B77D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="5 6"
            />
          </svg>
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Add something lush to your cart and treat yourself!</p>
        <Link className="btn-primary" href="/products">
          Browse Products
        </Link>
      </section>
    </div>
  );
}

export default CartEmpty;
