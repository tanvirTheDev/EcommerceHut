import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../sanity.types";

const ProductThumb = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stocks != null && product.stocks <= 0;

  const description =
    product.description
      ?.map((block) => {
        if (block._type === "block") {
          return block.children?.map((child) => child.text).join(" ");
        }
        return null;
      })
      .filter((text) => text !== null)
      .join(" ") || "";

  const truncatedDescription =
    description.length > 80
      ? `${description.substring(0, 80)}...`
      : description;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className="group relative flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        {product.image ? (
          <>
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name || "Product Image"}
              className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-110"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={false}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-red-500/90 text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base shadow-lg">
              Out of Stock
            </div>
          </div>
        )}

        {/* Stock Badge */}
        {!isOutOfStock &&
          product.stocks != null &&
          product.stocks > 0 &&
          product.stocks < 10 && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md z-10">
              Only {product.stocks} left
            </div>
          )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Product Name */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        {/* Description */}
        {truncatedDescription && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 flex-1 line-clamp-2">
            {truncatedDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {product.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
          {!isOutOfStock && (
            <span className="text-xs sm:text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
};

export default ProductThumb;
