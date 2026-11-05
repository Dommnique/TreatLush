import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <section className="hero">
      <Image
        src="/assets/hero_section_compressed.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
        className="hero-image"
      />

      <div className="overlay" />

      <div className="hero-content">
        <h1>GOODNESS YOU CAN TASTE</h1>

        <p>Fresh yogurt, granola and parfaits made with quality ingredients.</p>

        <Link href="/products" className="hero-cta">
          Shop Now
        </Link>
      </div>
    </section>
  );
}

export default Hero;
