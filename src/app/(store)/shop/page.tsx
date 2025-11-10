import ProductView from "@/components/ProductView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const ShopPage = async () => {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-linear-to-r from-blue-50 via-white to-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-4">
              Shop
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Discover Products You 7ll Love
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Browse our curated collection of products. Filter by category,
              explore new arrivals, and find the perfect pieces for your space.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <ProductView products={products} categories={categories} />
      </section>
    </div>
  );
};

export default ShopPage;
