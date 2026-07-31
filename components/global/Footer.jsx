import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

function Footer() {
    return(
        <section className="footer-section">
            <section className="footer-top">
            <div className="footer-text">
                <h2>TreatLush.</h2>
                <p>Goodness You Can Taste</p>
            </div>

            <div className="footer-links">
                <ul>
                    <li><a href="#"><FaInstagram/></a></li>
                    <li><a href="#"><FaWhatsapp/></a></li>
                    <li><a href="#"><FaTiktok/></a></li>
                </ul>
            </div>
            </section>

            <section className="footer-center">
                <div className="quick-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Products</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-products">
                    <h3>Products</h3>
                    <ul>
                        <li><a href="#">Greek Yogurt</a></li>
                        <li><a href="#">Parfait</a></li>
                        <li><a href="#">Granola</a></li>
                        <li><a href="#">Yogurt Drink</a></li>
                        <li><a href="#">Zobo</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <ul>
                        <li><a href="tel:+2348142570688">+234 814 257 0688</a></li>
                        <li className="location">Warri, Nigeria.</li>
                        <li><a href="mailto:yenumnmor@gmail.com">hello@treatlush.com</a></li>
                    </ul>
                </div>
            </section>

            <section className="footer-end">
                <p>&copy; 2026 TreatLush. All Rights Reserved</p>
                <p className="designed">Designed & Developed by Dominic Omeke</p>
            </section>
        </section>
    )
}

export default Footer;