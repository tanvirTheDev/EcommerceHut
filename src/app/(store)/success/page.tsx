"use client";

import { Button } from "@/components/ui/button";
import useBasketStore from "@/store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const transactionId = searchParams.get("transactionId");
  const status = searchParams.get("status");
  const clearBasket = useBasketStore((state) => state.clearBasket);

  useEffect(() => {
    if (orderNumber) {
      clearBasket();
    }
  }, [orderNumber, clearBasket]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="size-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="N5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center">
          {status === "pending_verification"
            ? "Payment Submitted! 📱"
            : "Payment Successful! 🎉"}
        </h1>
        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <p className="text-center mb-4">
            {status === "pending_verification"
              ? "Your payment details have been submitted for verification. We'll confirm your payment within 24 hours and process your order."
              : "Your bKash payment has been confirmed and your order will be processed shortly."}
          </p>
          <div className="space-y-2">
            {orderNumber && (
              <p className="text-gray-600 flex items-center justify-between">
                <span>Order Number:</span>
                <span className="font-mono text-sm text-green-600">
                  {orderNumber}
                </span>
              </p>
            )}
            {transactionId && (
              <p className="text-gray-600 flex items-center justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono text-sm text-blue-600">
                  {transactionId}
                </span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
              <Button asChild className="bg-green-600 hover:bg-geen-700">
                <Link href="/orders">View Orders Details</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
