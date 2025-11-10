import { Category, Product } from "../../sanity.types";
import ProductGrid from "./ProductGrid";
import CategorySelectorComponent from "./ui/category-selector";

interface ProductViewProps {
  products: Product[];
  categories: Category[];
}

const ProductView = ({ products, categories }: ProductViewProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto sm:min-w-[200px] lg:min-w-[240px]">
          <CategorySelectorComponent categories={categories} />
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full">
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default ProductView;
