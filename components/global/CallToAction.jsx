import Link from "next/link";

function CallToAction() {
  return (
    <>
      <section className="main-cta-section">
        <section className="cta-section">
          <div className="cta-words">
            <h2>
              Ready for your <span>TreatLush</span> Experience?
            </h2>
            <p>
              From Greek yogurt to farfaits ang granola, TreatLush delivers
              doodness straight to your doorstep.
            </p>
            <Link href="/products">
              <button>Order Now</button>
            </Link>
          </div>

          <div className="cta-video">
            <video
              src="/assets/cta-video.mov"
              autoPlay
              loop
              muted
              playsInline
            ></video>
          </div>
        </section>
      </section>
    </>
  );
}

export default CallToAction;
