import { FaLeaf } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaSeedling } from "react-icons/fa";

function Values() {
    return (
        <section className="values-section">
            <h2>Our Values</h2>

            <div className="values-cards">
                <div className="value-card">
                    <FaLeaf/>
                    <h3>Fresh Ingredients</h3>
                    <p>Made fresh daily using hogh-quality ingredients for exceptional taste and nutrition.</p>
                </div>

                <div className="value-card">
                    <FaHeart/>
                    <h3>Probiotic Benefits</h3>
                    <p>Nourishing your gut with every spoonful for a healthier, happier you.</p>
                </div>

                <div className="value-card">
                    <FaSeedling/>
                    <h3>No Artificial Additives</h3>
                    <p>Free from artificial ingredients because wholesome food should stay wholsesome.</p>
                </div>
            </div>
        </section>
    )
}

export default Values