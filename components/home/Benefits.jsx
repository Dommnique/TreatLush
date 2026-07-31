import { GiFruitBowl } from 'react-icons/gi';
import { FaTruck } from 'react-icons/fa';
import { FaLeaf } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';

function Benefits() {
    return(
        <section className='why-choose-us'>
            <h2>Why Choose Us</h2>
            <p className='slogan'><span>Freshness.</span> <span>Quality.</span> <span>Convenience.</span></p>
    

            <div className='benefits'>
                <div className='benefit-card'>
                    <GiFruitBowl/>
                    <h3>Fresh Ingredients</h3>
                    <p>We use only carefully selected, premium ingredients to ensure every bite is delicious and nutritious</p>
                </div>

                <div className='benefit-card'>
                    <FaTruck/>
                    <h3>Fast Delivery</h3>
                    <p>Your favorite treats delivered fresh and right on time, everytime</p>
                </div>

                <div className='benefit-card'>
                    <FaLeaf/>
                    <h3>Healthy Choices</h3>
                    <p>From Greek yogurt to granola, our products are made to support a healthier lifestyle</p>
                </div>

                <div className='benefit-card'>
                    <FaHeart/>
                    <h3>Made With Love</h3>
                    <p>Every product is handcrafted with attention to detail, quality, and care.</p>
                </div>
            </div>
        </section>
    )
}

export default Benefits;