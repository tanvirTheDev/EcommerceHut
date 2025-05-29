import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductByName = async (serchParam: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(`
        *[
            _type == "product" &&
            name match $searchParam
        ] | order(name asc)
        `);

  try {
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam: `*${serchParam}*`,
      },
    });
    return products.data || [];
  } catch (error) {
    console.error("Error searching products by name:", error);
    return [];
  }
};
