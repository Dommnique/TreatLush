import Benefits from "@/components/home/Benefits";
import Bestseller from "@/components/home/Bestseller";
import CallToAction from "@/components/global/CallToAction";
import Footer from "@/components/global/Footer";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/global/Navbar";
import Testimonial from "@/components/home/Testimonial";
import "./home.css";

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Bestseller />
      <Benefits />
      <Testimonial />
      <CallToAction />
      <Footer />
    </>
  );
}

export default Homepage;
