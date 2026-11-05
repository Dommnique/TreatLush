import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";

function Footer() {
    return (
      <section className="footer-section">
        <section className="footer-top">
          <div className="footer-text">
            <h2>TreatLush.</h2>
            <p>Goodness You Can Taste</p>
          </div>

          <div className="footer-links">
            <ul>
              <li>
                <Link href="https://www.instagram.com/treat_lush?rpxt=dzVvMHRzYjVzNHhr&utm_source=qr">
                  <FaInstagram />
                </Link>
              </li>
              <li>
                <Link href="https://wa.me/message/HROW7XXXSUXHP1">
                  <FaWhatsapp />
                </Link>
              </li>
              <li>
                <Link href="https://www.tiktok.com/@treat_lush?_r=1&_t=ZS-9AiOllJmkFT">
                  <FaTiktok />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="footer-center">
          <div className="quick-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-products">
            <h3>Products</h3>
            <ul>
              <li>
                <Link href="/products?category=Greek%20Yogurt">Greek Yogurt</Link>
              </li>
              <li>
                <Link href="/products?category=Parfait">Parfait</Link>
              </li>
              <li>
                <Link href="products?category=Granola">Granola</Link>
              </li>
              <li>
                <Link href="products?category=Yogurt">Yogurt Drink</Link>
              </li>
              <li>
                <Link href="products?category=Zobo">Zobo</Link>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <Link href="tel:+2348142570688">+234 814 257 0688</Link>
              </li>
              <li className="location">Warri, Nigeria.</li>
              <li>
                <Link href="mailto:treatlush@gmail.com">hello@treatlush.com</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="footer-end">
          <p>&copy; 2026 TreatLush. All Rights Reserved</p>
          <p className="designed">Designed & Developed by Dominic Omeke</p>
        </section>
      </section>
    );
}

export default Footer;