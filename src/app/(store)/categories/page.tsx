import { imageUrl } from "@/lib/imageUrl";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const CategoriesPage = async () => {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-linear-to-r from-blue-50 via-white to-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-3">
              Categories
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Explore our collection of categories and discover products that
              suit your lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!categories || categories.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center text-gray-600">
              No categories available.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-8">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug?.current}`}
                  className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-4/3">
                    {category.image ? (
                      <Image
                        src={imageUrl(category.image).url()}
                        alt={category.title || "Category image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Tag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
                  </div>

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
                    <h2 className="text-base sm:text-lg font-semibold truncate">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
