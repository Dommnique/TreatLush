import ProductsCard from "./ProductsCard";

function AllProducts(props) {
  const overallProducts = props.items;

  return (
    <>
      <section className="bestseller-section">
        <div className="bestseller">
          <ProductsCard items={overallProducts} />
        </div>
      </section>
    </>
  );
}

export default AllProducts;
