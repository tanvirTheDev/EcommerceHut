"use client";

import {
  BkashPaymentData,
  formatAmount,
  generatePaymentInstructions,
} from "@/lib/bkash";
import useBasketStore from "@/store/store";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BkashPaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearBasket = useBasketStore((state) => state.clearBasket);

  const orderNumber = searchParams.get("orderNumber");
  const transactionId = searchParams.get("transactionId");

  const [orderData, setOrderData] = useState<BkashPaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    transactionId: "",
    senderNumber: "",
    screenshot: null as File | null,
  });

  useEffect(() => {
    if (orderNumber) {
      fetchOrderData();
    }
  }, [orderNumber]);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/order/${orderNumber}`);
      const order = await response.json();

      if (response.ok && order) {
        setOrderData({
          orderNumber: order.orderNumber,
          amount: order.amount,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          items:
            order.products?.map((item: any) => ({
              name: item.product?.name || "Product",
              quantity: item.quantity,
              price: 0, // Will be calculated from total
            })) || [],
        });
      } else {
        throw new Error(order.error || "Failed to fetch order");
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setError("Failed to load order information");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmitted = async () => {
    if (!orderNumber) return;

    setIsConfirming(true);
    setError(null);

    try {
      console.log("Submitting payment verification...");
      console.log("Order data:", orderData);

      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber,
          transactionId: paymentForm.transactionId,
          senderNumber: paymentForm.senderNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to submit payment verification"
        );
      }

      console.log("Payment verification submitted:", result);

      setPaymentConfirmed(true);
      clearBasket();

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(
          `/success?orderNumber=${orderNumber}&status=pending_verification`
        );
      }, 3000);
    } catch (error) {
      console.error("Error submitting payment verification:", error);
      console.error("Error details:", error);
      setError(
        `Failed to submit payment verification: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentForm((prev) => ({ ...prev, screenshot: file }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/basket")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Basket
          </button>
        </div>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Payment Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Redirecting to success page...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Order Not Found
          </h1>
          <button
            onClick={() => router.push("/basket")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Basket
          </button>
        </div>
      </div>
    );
  }

  const instructions = generatePaymentInstructions(orderData);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            bKash Payment
          </h1>
          <p className="text-gray-600">Complete your payment using bKash</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Payment Instructions
              </h2>
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <p
                    key={index}
                    className={`text-sm ${index === 0 ? "font-semibold text-lg text-blue-600" : "text-gray-700"}`}
                  >
                    {instruction}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Important:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Make sure to enter the exact amount</li>
                <li>• Take a screenshot of your payment confirmation</li>
                <li>
                  • Only click "Confirm Payment" after completing the bKash
                  transaction
                </li>
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order Number:</span>{" "}
                  {orderData.orderNumber}
                </p>
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {orderData.customerName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {orderData.customerEmail}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Payment Details
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatAmount(orderData.amount)}
                </div>
                <p className="text-sm text-green-700">
                  Amount to pay via bKash
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {!showPaymentForm ? (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600"
              >
                I've Made the Payment
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Payment Verification
                </h3>
                <p className="text-sm text-gray-600">
                  Please provide the following details to verify your payment:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={paymentForm.transactionId}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          transactionId: e.target.value,
                        }))
                      }
                      placeholder="Enter transaction ID from bKash"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your bKash Number
                    </label>
                    <input
                      type="tel"
                      value={paymentForm.senderNumber}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          senderNumber: e.target.value,
                        }))
                      }
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Screenshot (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a screenshot of your payment confirmation
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handlePaymentSubmitted}
                    disabled={
                      isConfirming ||
                      !paymentForm.transactionId ||
                      !paymentForm.senderNumber
                    }
                    className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isConfirming ? "Submitting..." : "Submit Payment Details"}
                  </button>

                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => router.push("/basket")}
              className="w-full bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BkashPaymentPage;
