/* eslint-disable @typescript-eslint/no-explicit-any */
import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await backendClient.fetch(
      `*[_type == "order" && defined(transactionId)] | order(paymentSubmittedAt desc)`
    );

    // Transform order data to match PaymentVerification interface
    const transformedData = data?.map((order: any) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      transactionId: order.transactionId,
      senderNumber: order.senderNumber,
      amount: order.totalPrice,
      customerName: order.customerName,
      customerEmail: order.email,
      status: order.paymentStatus || "pending_verification",
      submittedAt: order.paymentSubmittedAt || order.orderDate,
      verifiedAt: order.paymentVerifiedAt,
      notes: order.paymentNotes,
      products:
        order.products?.map((item: any) => ({
          name: item.product?.name || "Unknown Product",
          price: item.product?.price || 0,
          quantity: item.quantity || 0,
        })) || [],
    }));

    return NextResponse.json(transformedData || []);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, notes } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData = {
      paymentStatus: status,
      paymentVerifiedAt: new Date().toISOString(),
      paymentNotes: notes || "",
    };

    // If verified, also update order status to paid
    if (status === "verified") {
      updateData.paymentStatus = "paid";
    }

    const result = await backendClient
      .patch(paymentId)
      .set(updateData)
      .commit();

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully",
      orderId: result._id,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
