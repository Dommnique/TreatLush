"use client";

import "@/app/products/products.css";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AllProducts from "@/components/products/AllProducts";
import ErrorPage from "./ErrorPage";

function ProductsContent(props) {
  const ProductsArr = props.availableItems;
  const theDisplayedItems = props.displayedItems;
  const setTheDisplayedItems = props.setDisplayedItems;
  const theActiveItems = props.activeItems;
  const setTheActiveItems = props.setActiveItems;
  const setTheSearchItem = props.setSearchItems;

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  // Map displayed category names to the values used in product data.
  const categoryMap = {
    All: "All",
    Yogurt: "Yogurt",
    Granola: "Granola",
    "Greek Yogurt": "Greek",
    Parfait: "Parfait",
    Zobo: "Zobo",
  };

  // Filter products by category.
  const filtered = (arr, query) => {
    const filteredItems = arr.filter((product) =>
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    setTheDisplayedItems(filteredItems);
  };

  // Handle category selection and update the URL.
  const handleCategoryClick = (category) => {
    if (category === "All") {
      setTheDisplayedItems(ProductsArr);
      setTheActiveItems("All");
      router.push("/products", { scroll: false });
      return;
    }

    const categoryToFilter = categoryMap[category];

    if (!categoryToFilter) return;

    filtered(ProductsArr, categoryToFilter);
    setTheActiveItems(category);

    router.push(`/products?category=${encodeURIComponent(category)}`, {
      scroll: false,
    });
  };

  // Apply a category when the page is opened through a category URL.
  useEffect(() => {
    if (!categoryFromUrl) {
      setTheDisplayedItems(ProductsArr);
      setTheActiveItems("All");
      return;
    }

    const categoryToFilter = categoryMap[categoryFromUrl];

    if (categoryToFilter && categoryToFilter !== "All") {
      filtered(ProductsArr, categoryToFilter);
      setTheActiveItems(categoryFromUrl);
    } else {
      // Invalid category in the URL: display all products.
      setTheDisplayedItems(ProductsArr);
      setTheActiveItems("All");
    }
  }, [categoryFromUrl, ProductsArr]);

  return (
    <div>
      <section className="products">
        <div className="categories">
          <div
            onClick={() => handleCategoryClick("All")}
            className={
              theActiveItems === "All" ? "active-category" : "inactive-category"
            }
          >
            All <span>{ProductsArr.length}</span>
          </div>

          <div
            onClick={() => handleCategoryClick("Yogurt")}
            className={
              theActiveItems === "Yogurt"
                ? "active-category"
                : "inactive-category"
            }
          >
            Yogurt
          </div>

          <div
            onClick={() => handleCategoryClick("Granola")}
            className={
              theActiveItems === "Granola"
                ? "active-category"
                : "inactive-category"
            }
          >
            Granola
          </div>

          <div
            onClick={() => handleCategoryClick("Greek Yogurt")}
            className={
              theActiveItems === "Greek Yogurt"
                ? "active-category"
                : "inactive-category"
            }
          >
            Greek Yogurt
          </div>

          <div
            onClick={() => handleCategoryClick("Parfait")}
            className={
              theActiveItems === "Parfait"
                ? "active-category"
                : "inactive-category"
            }
          >
            Parfait
          </div>

          <div
            onClick={() => handleCategoryClick("Zobo")}
            className={
              theActiveItems === "Zobo"
                ? "active-category"
                : "inactive-category"
            }
          >
            Zobo
          </div>
        </div>

        <div className="total-products">
          <p>
            <span>{theDisplayedItems.length}</span> products
          </p>
        </div>

        <div>
          {theDisplayedItems.length === 0 ? (
            <ErrorPage
              setItem={setTheDisplayedItems}
              arrItem={ProductsArr}
              activeItem={setTheActiveItems}
              setSearchValue={setTheSearchItem}
            />
          ) : (
            <AllProducts items={theDisplayedItems} />
          )}
        </div>
      </section>
    </div>
  );
}

function ProductsMain(props) {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsContent {...props} />
    </Suspense>
  );
}

export default ProductsMain;
