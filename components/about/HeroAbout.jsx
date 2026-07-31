import { FaArrowDown } from "react-icons/fa";

function HeroAbout() {
  return (
    <>
      <section className="hero-about">
        <div className="hero-about-content">
          <h1>
            ABOUT <span>TREATLUSH</span>
          </h1>
          <p>"Where Healthy Meets Delicious"</p>
          <hr />
          <p className="description">
            Crafting nutritrious experiences through Greek yogurt, granola, zobo
            & yogurt drinks, and parfaits since day one...
          </p>
        </div>

        <p className="scroll">
          Scroll to discover <FaArrowDown />
        </p>

        <div className="overlay-about"></div>
      </section>

      <section className="main-about">
        <section className="story-about">
          <div className="owner">
            <img src="/assets/owner.jpg" alt="Owner's Image" />
          </div>

          <div className="story">
            <h2>Our Story</h2>
            <p className="tagline">
              Healthy food should never feel like a compromise
            </p>
            <p>
              TreatLush was born from a simple belief: healthy food should never
              feel like a compromise.
            </p>

            <div>
              What started as a passion for creating nourishing treats quickly
              became a mission to redefine the way people experience snacks. In
              a world filled with artificial ingredients and rushed meals,
              TreatLush set out to create something different, something honest,
              wholesome, and genuinely delicious. <p />
              <p>
                Every cup of Greek yogurt, every spoonful of granola, and every
                handcrafted parfait is made with intention. We believe that
                wellness isn't found in strict diets or giving up the foods you
                love. It is found in the little choices you make every day, the
                choice to nourish your body while still satisfying your
                cravings.
              </p>
              <p>
                From our kitchen to your doorstep, TreatLush exists to remind
                you that healthy can be indulgent, nutritious can be exciting,
                and every bite can tell a story. This isn't just about yogurt;
                it's about creating moments of goodness that leave you feeling a
                little better than before.
              </p>
              <p>
                <span>And we're only getting started.</span>
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default HeroAbout;
