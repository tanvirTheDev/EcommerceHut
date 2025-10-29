"use server";

import { BkashPaymentResult, generateTransactionRef } from "@/lib/bkash";
import { backendClient } from "@/sanity/lib/backendClient";
import { BasketItem } from "@/store/store";

export type GroupedBasketItem = {
  product: BasketItem["product"];
  quantity: number;
};

export interface ShippingAddress {
  fullName: string;
  phone: string;
  district: string;
  address: string;
}

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  clerkUserId: string;
  shippingAddress: ShippingAddress;
}

export const createBkashPayment = async (
  items: GroupedBasketItem[],
  metadata: Metadata,
  paymentMethod = "bkash"
): Promise<BkashPaymentResult> => {
  try {
    console.log(
      "Starting bKash payment creation for order:",
      metadata.orderNumber
    );

    // Validate environment variable
    if (!process.env.SANITY_API_TOKEN) {
      throw new Error("SANITY_API_TOKEN is missing in environment variables.");
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for payment.");
    }

    const invalidItems = items.filter(
      (item) => !item.product || typeof item.product.price !== "number"
    );
    if (invalidItems.length > 0) {
      throw new Error("Some items are invalid or missing price.");
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );
    if (totalAmount <= 0) {
      throw new Error("Total amount must be greater than zero.");
    }

    console.log("Total amount:", totalAmount);

    // Prepare products for Sanity
    const sanityProducts = items.map((item) => ({
      _key: crypto.randomUUID(),
      product: { _type: "reference", _ref: item.product._id },
      quantity: item.quantity,
    }));

    // Create order in Sanity
    const order = await backendClient
      .create({
        _type: "order",
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        clerkUserId: metadata.clerkUserId,
        email: metadata.customerEmail,
        currency: "BDT",
        products: sanityProducts,
        totalPrice: totalAmount,
        orderDate: new Date().toISOString(),
        paymentMethod, // 👈 Added
        status: paymentMethod === "cod" ? "pending" : "pending",
        paymentStatus:
          paymentMethod === "cod"
            ? "pending_verification"
            : "pending_verification",
        shippingAddress: metadata.shippingAddress,
      })
      .catch((err) => {
        console.error("Sanity order creation failed:", err);
        throw new Error("Failed to create order in Sanity");
      });

    // Save or process payment differently based on method
    if (paymentMethod === "cod") {
      // ✅ For Cash on Delivery
      return {
        success: true,
        message: "Order placed successfully (Cash on Delivery)",
        orderNumber: metadata.orderNumber,
        redirectUrl: `/success?orderNumber=${metadata.orderNumber}&status=pending`,
      };
    }

    console.log("Order created successfully:", order._id);

    return {
      success: true,
      transactionId: generateTransactionRef(metadata.orderNumber),
      message: "Payment instructions generated successfully",
      orderNumber: metadata.orderNumber,
    };
  } catch (error) {
    console.error("Error in createBkashPayment:", error);
    return {
      success: false,
      message: `Error creating payment: ${
        error instanceof Error ? error.message : String(error)
      }`,
      orderNumber: metadata.orderNumber,
    };
  }
};

export const confirmBkashPayment = async (
  orderNumber: string,
  transactionId: string
): Promise<BkashPaymentResult> => {
  try {
    console.log("Confirming bKash payment for order:", orderNumber);

    const order = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    if (!order) {
      throw new Error("Order not found in database");
    }

    await backendClient
      .patch(order._id)
      .set({
        status: "paid",
        stripePaymentIntentId: transactionId, // storing bKash transaction here
        customerName: order.customerName,
      })
      .commit()
      .catch((err) => {
        console.error("Sanity order patch failed:", err);
        throw new Error("Failed to update order status in Sanity");
      });

    console.log("Payment confirmed successfully for order:", orderNumber);

    return {
      success: true,
      transactionId,
      message: "Payment confirmed successfully!",
      orderNumber,
    };
  } catch (error) {
    console.error("Error in confirmBkashPayment:", error);
    return {
      success: false,
      message: `Error confirming payment: ${
        error instanceof Error ? error.message : String(error)
      }`,
      orderNumber,
    };
  }
};
