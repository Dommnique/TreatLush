import ProductCard from "@/components/home/ProductCard";

function Bestseller() {
  const bestSellerProducts = [
    {
      id: 1,
      image: "/assets/banana_swirl2.jpg",
      title: "Banana Swril",
      price: 5000,
      rating: 4,
      description: "Yummy, tasty banana yogurt",
    },
    {
      id: 2,
      image: "/assets/herosection2.jpg",
      title: "Granola",
      price: 7000,
      rating: 4,
      description: "Crunchy raisin packed granola",
    },
    {
      id: 3,
      image: "/assets/Coco_cloud1.jpg",
      title: "Coco Cloud",
      price: 4000,
      rating: 4,
      description: "Sweet, chocolatey yogurt",
    },
    {
      id: 4,
      image: "/assets/Vanilla_whisper.jpg",
      title: "Vanilla Whisper",
      price: 8000,
      rating: 4,
      description: "Creamy, vaniila rich yogurt",
    },
  ];

  return (
    <>
      <section className="bestseller-section">
        <h2>Best Sellers</h2>
        <div className="bestseller">
          <ProductCard items={bestSellerProducts} />
        </div>
      </section>
    </>
  );
}

export default Bestseller;
