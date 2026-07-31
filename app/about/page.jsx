import CallToAction from "@/components/global/CallToAction";
import Footer from "@/components/global/Footer";
import HeroAbout from "@/components/about/HeroAbout";
import Navbar from "@/components/global/Navbar";
import Process from "@/components/about/Process";
import Values from "@/components/about/Values";
import "./about.css";

function Aboutpage() {
  return (
    <>
      <Navbar />
      <HeroAbout />
      <Values />
      <Process />
      <CallToAction />
      <Footer />
    </>
  );
}

export default Aboutpage;
