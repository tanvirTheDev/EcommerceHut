import { imageUrl } from "@/lib/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../sanity.types";

const ProductThumb = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stocks != null && product.stocks <= 0;
  // ...existing code...
  console.log("product.image:", product.image);
  console.log(
    "imageUrl:",
    product.image ? imageUrl(product.image).url() : "no image"
  );
  // ...existing code...
  return (
    <>
      <Link
        href={`/product/${product.slug?.current}`}
        className={`group flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow-sm  border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden ${isOutOfStock ? "opacity-30" : null}`}
      >
        <div className="relative aspect-square w-full h-full overflow-hidden">
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name || "Product Image"}
              className="object-cover transition-transform  group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {isOutOfStock && (
            <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h2>
          <p>
            {product.description
              ?.map((block) => {
                if (block._type === "block") {
                  return block.children?.map((child) => child.text).join(" ");
                }
                return null;
              })
              .filter((text) => text !== null)
              .join(" ")}
          </p>
          <p className="text-lg mt-2 font-bold text-gray-800">
            {product.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}{" "}
          </p>
        </div>
      </Link>
    </>
  );
};

export default ProductThumb;
