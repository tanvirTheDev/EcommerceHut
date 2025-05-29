import { defineQuery } from "next-sanity";
import { Sale } from "../../../../sanity.types";
import { sanityFetch } from "../live";
import { COUPON_CODES, CouponCode } from "./couponCodes";

export const getActiveSaleByCouponCode = async (
  couponKey: CouponCode
): Promise<Sale | null> => {
  const couponCode = COUPON_CODES[couponKey];
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
    *[_type == "sale" 
        && isActive == true
        && couponCode == $couponCode
    ] | order(validFrom desc)[0]
  `);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_BY_COUPON_QUERY,
      params: {
        couponCode,
      },
    });
    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error("Error fetching active sale:", error);
    return null;
  }
};
