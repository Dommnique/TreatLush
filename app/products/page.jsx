"use client";
import { useState } from "react";
import Navbar from "@/components/global/Navbar";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsMain from "@/components/products/ProductsMain";
import Footer from "@/components/global/Footer";
import products from "@/data/products";

function Products() {
  const [displayedProducts, setDisplayedProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  function searchProducts(query) {
    setSearchValue(query);

    const productsToSearch =
      activeCategory === "All"
        ? products
        : products.filter((product) => product.category === activeCategory);

    const filteredProducts = productsToSearch.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    setDisplayedProducts(filteredProducts);
  }
  return (
    <div>
      <Navbar />
      <ProductsHero
        searchItems={searchValue}
        setSearchItems={setSearchValue}
        SearchProductItems={searchProducts}
        availableItems={products}
        displayedItems={displayedProducts}
        setDisplayedItems={setDisplayedProducts}
        activeItems={activeCategory}
      />
      <ProductsMain
        availableItems={products}
        displayedItems={displayedProducts}
        setDisplayedItems={setDisplayedProducts}
        activeItems={activeCategory}
        setActiveItems={setActiveCategory}
        searchItems={searchValue}
        setSearchItems={setSearchValue}
      />
      <Footer />
    </div>
  );
}

export default Products;
