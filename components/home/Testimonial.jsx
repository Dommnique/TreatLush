import { FaStar } from "react-icons/fa";

function Testimonial() {
  return (
    <>
      <section className="main-testimonial">
        <h2 className="testimonial-heading">What Our Customers Say</h2>
        <div className="testimonial">
          <div className="testimonial-image">
            <img src="/assets/Call_to_Action.jpg" alt="" />
          </div>

          <div className="testimonial-cards">
            <div className="testimonial-card">
              <div className="rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Deleniti esse minus illo aperiam ipsum consequatur aliquid
                accusamus, corrupti, expedita atque at temporibus?
              </p>
              <h3>- Ada M.</h3>
            </div>

            <div className="testimonial-card middle">
              <div className="rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error
                et tempore voluptatum facere consequatur unde eaque
                reprehenderit consectetur, dolorum rerum tempora excepturi
                cupiditate?
              </p>
              <h3>- James K.</h3>
            </div>

            <div className="testimonial-card">
              <div className="rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Voluptas nobis obcaecati illum, atque cum accusamus dolore natus
                eos!
              </p>
              <h3>- Esther N.</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonial;
