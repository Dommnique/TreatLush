"use client";
import { useState } from "react";
import Navbar from "@/components/global/Navbar";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsMain from "@/components/products/ProductsMain";
import Footer from "@/components/global/Footer";

function Products() {
  const AvailProducts = [
    {
      id: 1,
      image: "/assets/banana_swirl2.jpg",
      title: "Banana Swril",
      category: "Yogurt",
      price: 5000,
      rating: 4,
      description: "Yummy, tasty banana yogurt",
    },
    {
      id: 2,
      image: "/assets/herosection2.jpg",
      title: "Granola",
      category: "Granola",
      price: 7000,
      rating: 4,
      description: "Crunchy raisin packed granola",
    },
    {
      id: 3,
      image: "/assets/Coco_cloud1.jpg",
      title: "Coco Cloud",
      category: "Yogurt",
      price: 4000,
      rating: 4,
      description: "Sweet, chocolatey yogurt",
    },
    {
      id: 4,
      image: "/assets/Vanilla_whisper.jpg",
      title: "Vanilla Whisper",
      category: "Yogurt",
      price: 8000,
      rating: 4,
      description: "Creamy, vaniila rich yogurt",
    },
    {
      id: 5,
      image: "/assets/Vanilla_whisper.jpg",
      title: "Vanilla Whisper",
      category: "Greek yogurt",
      price: 8000,
      rating: 4,
      description: "Creamy, vaniila rich yogurt",
    },
    {
      id: 6,
      image: "/assets/Vanilla_whisper.jpg",
      title: "Vanilla Whisper Yogurt",
      category: "Greek yogurt",
      price: 8000,
      rating: 4,
      description: "Creamy, vaniila rich yogurt",
    },
    {
      id: 7,
      image: "/assets/Vanilla_whisper.jpg",
      title: "Vanilla Whisper",
      price: 8000,
      category: "Greek Yogurt",
      rating: 4,
      description: "Creamy, vaniila rich yogurt",
    },
  ];

  const [displayedProducts, setDisplayedProducts] = useState(AvailProducts);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  function searchProducts(query: string) {
    setSearchValue(query);

    const productsToSearch =
      activeCategory === "All"
        ? AvailProducts
        : AvailProducts.filter(
            (product) => product.category === activeCategory
          );

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
      />
      <ProductsMain
        availableItems={AvailProducts}
        displayedItems={displayedProducts}
        setDisplayedItems={setDisplayedProducts}
        activeItems={activeCategory}
        setActiveItems={setActiveCategory}
        searchItems={searchValue}
        serSearchItems={setSearchValue}
      />
      <Footer />
    </div>
  );
}

export default Products;
