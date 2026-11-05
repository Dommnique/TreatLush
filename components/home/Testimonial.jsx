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
                Ohh my love! I literally enjoyed it. it’s 10/10 and the
                packaging too, it’s nice for real
              </p>
              <h3>- Favor</h3>
            </div>

            <div className="testimonial-card middle">
              <div className="rating">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>My Mom loved it! They didn't even allow me eat in peace</p>
              <h3>- Judith</h3>
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
                Your granola is so nice and different! I love how crunchy it
                was. Definitely coming back for more.
              </p>
              <h3>- Franca</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonial;
