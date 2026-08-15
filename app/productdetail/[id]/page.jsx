"use client";

import { useParams } from "next/navigation";
import Navbar from "../../../components/global/Navbar";
import Footer from "../../../components/global/Footer";
import ProductDetail from "../../../components/products/ProductDetail";

function ProductDetailPage() {
  const params = useParams();

  return (
    <div>
      <Navbar />
      <ProductDetail items={params} />
      <Footer />
    </div>
  );
}

export default ProductDetailPage;
