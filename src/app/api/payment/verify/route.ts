import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, transactionId, senderNumber } = body;

    if (!orderNumber || !transactionId || !senderNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the order
    const orders = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber }
    );

    if (!orders) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order with payment verification data
    const paymentVerificationData = {
      transactionId,
      senderNumber,
      paymentSubmittedAt: new Date().toISOString(),
      paymentStatus: "pending_verification",
    };

    const result = await backendClient
      .patch(orders._id)
      .set(paymentVerificationData)
      .commit();

    return NextResponse.json({
      success: true,
      message: "Payment verification submitted successfully",
      orderId: result._id,
    });
  } catch (error) {
    console.error("Error submitting payment verification:", error);
    return NextResponse.json(
      { error: "Failed to submit payment verification" },
      { status: 500 }
    );
  }
}
