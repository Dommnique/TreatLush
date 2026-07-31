"use client";
import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import "@/app/products/products.css";

function ProductHero(props) {
  const theSearchItem = props.searchItems;
  const setTheSearchItem = props.setSearchItems;
  const theSearchProducts = props.SearchProductItems;

  return (
    <div>
      <section className="products-hero">
        <div className="products-subhero">
          <h1>OUR PRODUCTS</h1>
          <p>
            Fresh yogurt, granola and parfaits, made in small batches daily.{" "}
            <br />
            Search or filter by category to find your next favorite.
          </p>

          <div className="search">
            <input
              type="text"
              name="searchbar"
              id="searchBar"
              className="search-bar"
              placeholder="Search products e.g granola, parfait ..."
              onChange={(e) => {
                theSearchProducts(e.target.value);
                console.log(theSearchItem);
              }}
              value={theSearchItem}
            />
            {theSearchItem === "" ? (
              <FaSearch className="search-icon" />
            ) : (
              <FaTimes
                className="search-icon"
                onClick={() => setTheSearchItem("")}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductHero;
