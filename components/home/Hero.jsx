import Link from "next/link";

function Hero() {
  return (
    <>
      <section className="hero">
        <div className="overlay"></div>

        <div className="hero-content">
          <h1>GOODNESS YOU CAN TASTE</h1>
          <p>
            Fresh yogurt, granola and parfaits made with quaity ingredients.
          </p>
          <Link href="/products">
            <button>Shop Now</button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Hero;
