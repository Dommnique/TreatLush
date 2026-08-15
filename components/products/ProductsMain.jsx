"use client";

import "@/app/products/products.css";
import { useState } from "react";
import AllProducts from "@/components/products/AllProducts";
import ErrorPage from "./ErrorPage";

function ProductsMain(props) {
  const ProductsArr = props.availableItems;
  const theDisplayedItems = props.displayedItems;
  const setTheDisplayedItems = props.setDisplayedItems;
  const theActiveItems = props.activeItems;
  const setTheActiveItems = props.setActiveItems;
  const setTheSearchItem = props.setSearchItems;

  const filtered = function filterItems(arr, query) {
    const filteredItem = arr.filter((product) =>
      product.category.includes(query)
    );
    setTheDisplayedItems(filteredItem);
    console.log(filteredItem);
  };

  return (
    <div>
      <section className="products">
        <div className="categories">
          <div
            onClick={() => {
              setTheDisplayedItems(ProductsArr);
              setTheActiveItems("All");
            }}
            className={
              theActiveItems === "All" ? "active-category" : "inactive-category"
            }
          >
            All <span>{ProductsArr.length}</span>
          </div>
          <div
            onClick={() => {
              filtered(ProductsArr, "Yogurt");
              setTheActiveItems("Yogurt");
            }}
            className={
              theActiveItems === "Yogurt"
                ? "active-category"
                : "inactive-category"
            }
          >
            Yogurt
          </div>
          <di
            onClick={() => {
              filtered(ProductsArr, "Granola");
              setTheActiveItems("Granola");
            }}
            className={
              theActiveItems === "Granola"
                ? "active-category"
                : "inactive-category"
            }
          >
            Granola
          </di>

          <div
            onClick={() => {
              filtered(ProductsArr, "Greek");
              setTheActiveItems("Greek");
            }}
            className={
              theActiveItems === "Greek"
                ? "active-category"
                : "inactive-category"
            }
          >
            Greek Yogurt
          </div>

          <div
            onClick={() => {
              filtered(ProductsArr, "Parfait");
              setTheActiveItems("Parfait");
            }}
            className={
              theActiveItems === "Parfait"
                ? "active-category"
                : "inactive-category"
            }
          >
            Parfait
          </div>

          <div
            onClick={() => {
              filtered(ProductsArr, "Zobo");
              setTheActiveItems("Zobo");
            }}
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
            <span>{theDisplayedItems.length}</span>products
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
export default ProductsMain;
