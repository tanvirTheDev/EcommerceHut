import HeroSection from "@/components/HeroSection";
import ProductView from "@/components/ProductView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  console.log(products);
  return (
    <div>
      <HeroSection />
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <ProductView products={products} categories={categories} />
      </div>
    </div>
  );
}
