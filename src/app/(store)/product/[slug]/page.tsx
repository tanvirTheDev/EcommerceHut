import AddToBasketButton from "@/components/ui/AddToBasketButton";
import { imageUrl } from "@/lib/imageUrl";
import { getProductBySLug } from "@/sanity/lib/products/getProductBySLug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Product } from "../../../../../sanity.types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product: Product | null = await getProductBySLug(slug);
  if (!product) {
    return notFound();
  }

  const isOutOfStock = product.stocks != null && product.stocks <= 0;
  return (
    <div className="cibtauber nx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={`relative aspect-square overflow-hidden rounded-lg shadow-lg ${isOutOfStock ? "opacity-50" : ""}`}
        >
          <Image
            src={product.image ? imageUrl(product.image).url() : ""}
            alt={product.name ?? "Product Image"}
            fill
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
          {isOutOfStock && (
            <div
              className={`absolute insert-0 flex items-center justify-center bg-black bg-opacity-50 ${isOutOfStock ? "opacity-50" : ""}`}
            >
              <span className="text-white font-bold text-lg">Out of Stoks</span>
            </div>
          )}
        </div>
        {/* content */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-xl font-semibold mb-4">
            {product.price?.toFixed(2)}
          </div>
          <div className="prose max-w-none mb-6">
            {Array.isArray(product.description) && (
              <PortableText value={product.description} />
            )}
          </div>
          <div className="mt-6">
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
