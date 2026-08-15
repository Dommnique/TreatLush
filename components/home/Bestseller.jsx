import ProductCard from "@/components/home/ProductCard";

function Bestseller() {
  const bestSellerProducts = [
    {
      id: 2,
      image: "/assets/coco_cloud_250.jpg",
      category: "Yogurt",
      title: "Coco Cloud",
      tagline: "A creamy little escape into chocolatey goodness.",
      price: 8000,
      rating: 4,
      quantity: "250ml",
      description:
        "Rich, creamy, and delightfully chocolatey, Coco Cloud is a smooth yogurt drink made for those moments when you want something indulgent without compromising on goodness.",
      why: [
        "Rich chocolatey flavor",
        "Smooth and creamy texture",
        "A deliciously satisfying treat",
      ],
      availability: "In stock",
      ingredients:
        "Made with fresh yogurt, milk, cocoa, and carefully selected natural ingredients blended together to create a rich and creamy chocolate experience.",
    },

    {
      id: 4,
      image: "/assets/parfait.jpg",
      category: "Parfait",
      title: "Parfait",
      tagline: "Layers of creamy, crunchy, delicious goodness.",
      price: 5000,
      rating: 5,
      quantity: "500ml",
      description:
        "A delightful combination of creamy yogurt, crunchy granola, and delicious toppings layered together to create a treat that is as beautiful as it is satisfying.",
      why: [
        "Creamy and crunchy in every bite",
        "Perfect balance of flavors and textures",
        "Great for breakfast or dessert",
      ],
      availability: "In stock",
      ingredients:
        "Made with fresh yogurt, crunchy granola, fresh fruits, and carefully selected toppings layered together for a delicious and satisfying treat.",
    },

    {
      id: 7,
      image: "/assets/zobo_500.jpg",
      category: "Zobo",
      title: "Zobo",
      tagline: "Bold, fruity, refreshing goodness.",
      price: 4500,
      rating: 4,
      quantity: "250ml",
      description:
        "A refreshing twist on the classic Zobo drink, made with hibiscus and natural fruity flavors. Bright, bold, and best enjoyed chilled.",
      why: [
        "Bold and refreshing flavor",
        "Infused with natural fruity goodness",
        "Perfect served chilled",
      ],
      availability: "In stock",
      ingredients:
        "Made with hibiscus petals, ginger, pineapple, natural spices, and carefully selected ingredients to create a refreshing and flavorful drink.",
    },

    {
      id: 3,
      image: "/assets/greek_yogurt_500.jpg",
      category: "Greek Yogurt",
      title: "Greek Yogurt",
      tagline: "Thick, creamy, wholesome goodness.",
      price: 5000,
      rating: 4,
      quantity: "500ml",
      description:
        "Our creamy Greek Yogurt is thick, satisfying, and packed with the rich texture you love. It is a wholesome option that can be enjoyed on its own or paired with your favorite toppings.",
      why: [
        "Rich and creamy Greek yogurt",
        "Satisfying and versatile",
        "Perfect for breakfast or snacking",
      ],
      availability: "In stock",
      ingredients:
        "Made with fresh milk and live yogurt cultures, carefully prepared to create a naturally thick, creamy, and satisfying Greek yogurt.",
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
