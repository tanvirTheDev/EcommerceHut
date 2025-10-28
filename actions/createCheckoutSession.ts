"use server";

import { BasketItem } from "@/store/store";
import { createBkashPayment } from "./createBkashPayment";

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  clerkUserId: string;
};

export type groupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export const createCheckoutSession = async (
  items: groupedBasketItem[],
  metadata: Metadata
) => {
  try {
    console.log("Creating checkout session for order:", metadata.orderNumber);
    console.log("Items:", items.length);

    // Check if any grouped items don't have a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    console.log("Creating bKash payment...");
    // Create bKash payment
    const paymentResult = await createBkashPayment(items, metadata);

    console.log("Payment result:", paymentResult);

    if (!paymentResult.success) {
      throw new Error(paymentResult.message);
    }

    // Return the bKash payment page URL instead of Stripe checkout URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const paymentUrl = `${baseUrl}/bkash-payment?orderNumber=${metadata.orderNumber}&transactionId=${paymentResult.transactionId}`;

    console.log("Redirecting to:", paymentUrl);
    return paymentUrl;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};
