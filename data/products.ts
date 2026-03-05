export type ProductCategory = "powder" | "whole" | "mixed";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "ceylon-cinnamon-powder",
    slug: "ceylon-cinnamon-powder",
    name: "Ceylon Cinnamon Powder",
    price: 950,
    category: "powder",
    shortDescription: "Pure Ceylon cinnamon powder with a sweet, delicate aroma.",
    description:
      "Our Ceylon Cinnamon Powder is sourced from small-scale farmers in Sri Lanka and finely ground to preserve its delicate sweetness and aroma. Perfect for baking, beverages, and everyday cooking, this premium spice is free from additives and preservatives.",
    image: "/images/ceylon-cinnamon-powder.svg",
  },
  {
    id: "turmeric-powder",
    slug: "turmeric-powder",
    name: "Turmeric Powder",
    price: 750,
    category: "powder",
    shortDescription: "Vibrant turmeric powder rich in natural curcumin.",
    description:
      "Our Turmeric Powder is made from hand-selected turmeric roots, sun-dried and stone-ground to retain their natural curcumin and earthy flavor. Ideal for curries, golden milk, and wellness blends.",
    image: "/images/turmeric-powder.svg",
  },
  {
    id: "black-pepper-whole",
    slug: "black-pepper-whole",
    name: "Black Pepper",
    price: 1200,
    category: "whole",
    shortDescription: "Whole black peppercorns with bold, robust heat.",
    description:
      "These whole Black Peppercorns are harvested at peak ripeness and sun-dried to lock in their bold, pungent flavor. Grind fresh over your dishes for maximum aroma and depth.",
    image: "/images/black-pepper.svg",
  },
  {
    id: "curry-powder",
    slug: "curry-powder",
    name: "Curry Powder",
    price: 850,
    category: "mixed",
    shortDescription: "A balanced Sri Lankan curry blend for everyday cooking.",
    description:
      "Our Curry Powder is a carefully balanced blend of roasted Sri Lankan spices, crafted to bring authentic flavor to your home cooking. Use it as a base for vegetable, meat, or seafood curries.",
    image: "/images/curry-powder.svg",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 3): Product[] {
  return products.filter((product) => product.slug !== slug).slice(0, limit);
}

