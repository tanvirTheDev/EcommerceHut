"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "../../sanity.types";
import ProductThumb from "./ProductThumb";

const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="w-full">
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {products.map((product, index) => {
            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full"
              >
                <ProductThumb product={product} />
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-gray-500 text-lg font-medium">No products found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
