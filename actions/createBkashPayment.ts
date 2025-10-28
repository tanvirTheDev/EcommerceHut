"use server";

import { BkashPaymentResult, generateTransactionRef } from "@/lib/bkash";
import { backendClient } from "@/sanity/lib/backendClient";
import { BasketItem } from "@/store/store";

export type groupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  clerkUserId: string;
};

export const createBkashPayment = async (
  items: groupedBasketItem[],
  metadata: Metadata
): Promise<BkashPaymentResult> => {
  try {
    console.log("Creating bKash payment for order:", metadata.orderNumber);

    // Check if any items don't have a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.product.price || 0) * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      throw new Error("Invalid total amount");
    }

    console.log("Total amount calculated:", totalAmount);

    // Create order in Sanity with pending status
    const sanityProducts = items.map((item) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity,
    }));

    console.log("Creating order in Sanity...");

    // Check if we have the required environment variables
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error(
        "SANITY_API_TOKEN is not configured. Please add it to your .env.local file."
      );
    }

    const order = await backendClient.create({
      _type: "order",
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      clerkUserId: metadata.clerkUserId,
      email: metadata.customerEmail,
      currency: "BDT",
      products: sanityProducts,
      totalPrice: totalAmount,
      status: "pending", // Will be updated to "paid" after payment confirmation
      orderDate: new Date().toISOString(),
    });

    console.log("Order created successfully:", order._id);

    return {
      success: true,
      transactionId: generateTransactionRef(metadata.orderNumber),
      message: "Payment instructions generated successfully",
      orderNumber: metadata.orderNumber,
    };
  } catch (error) {
    console.error("Error creating bKash payment:", error);
    return {
      success: false,
      message: `Error creating payment: ${error}`,
      orderNumber: metadata.orderNumber,
    };
  }
};

export const confirmBkashPayment = async (
  orderNumber: string,
  transactionId: string
): Promise<BkashPaymentResult> => {
  try {
    // Update order status to paid
    const orders = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    if (!orders) {
      throw new Error("Order not found");
    }

    await backendClient
      .patch(orders._id)
      .set({
        status: "paid",
        stripePaymentIntentId: transactionId, // Reusing this field for bKash transaction ID
        customerName: orders.customerName,
      })
      .commit();

    return {
      success: true,
      transactionId,
      message: "Payment confirmed successfully!",
      orderNumber,
    };
  } catch (error) {
    console.error("Error confirming bKash payment:", error);
    return {
      success: false,
      message: `Error confirming payment: ${error}`,
      orderNumber,
    };
  }
};
