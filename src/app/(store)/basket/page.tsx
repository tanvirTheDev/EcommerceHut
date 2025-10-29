"use client";
import Loader from "@/components/Loader";
import AddToBasketButton from "@/components/ui/AddToBasketButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/store/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBkashPayment } from "../../../../actions/createBkashPayment";

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

const BasketPage = () => {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    district: "",
    address: "",
  });
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[150vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-600">Your Basket</h1>
        <p className="text-gray-700 text-lg">Your basket is empty.</p>
      </div>
    );
  }

  const isAddressFilled =
    address.fullName.trim() &&
    address.phone.trim() &&
    address.district.trim() &&
    address.address.trim();

  const handleCheckout = async () => {
    if (!isSignedIn) return;
    if (!isAddressFilled) {
      alert(
        "Please fill in your shipping address before proceeding to payment."
      );
      return;
    }
    setIsLoading(true);

    try {
      console.log("Starting checkout process...");
      console.log("Grouped items:", groupedItems);
      console.log("User:", user);

      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
        customerPhone: customerPhone || undefined,
        clerkUserId: user!.id,
        shippingAddress: address,
      };

      console.log("Metadata:", metadata);

      const result = await createBkashPayment(
        groupedItems,
        metadata,
        paymentMethod
      );
      console.log("Transaction ID:", result.transactionId);
      if (!result.success) {
        throw new Error(result.message || "Failed to create checkout session");
      }

      if (paymentMethod === "cod" && result.redirectUrl) {
        router.push(result.redirectUrl);
      } else {
        window.location.href = `/bkash-payment?orderNumber=${result.orderNumber}&transactionId=${result.transactionId}`;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(
        `Failed to create checkout session: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  const canCheckout = isAddressFilled && !isLoading;
  console.log("Basket contents", groupedItems);
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="grow">
          {groupedItems?.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center justify-between"
            >
              <div
                className="flex items-center cursor-pointer flex-1 min-w-0"
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                <div className="size-20 sm:size-20 shrink-0 mr-4">
                  {item.product.image && (
                    <Image
                      src={imageUrl(item.product.image).url()}
                      alt={item.product.name ?? "Product image"}
                      className="w-full h-full object-cover rounded"
                      width={96}
                      height={96}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {item.product.name}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Price :
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-4 shrink-0">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items</span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>{useBasketStore.getState().getTotalPrice()}</span>
            </p>
          </div>

          {/* 222 */}
          <div className="mt-6">
            <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
              <DialogTrigger asChild>
                <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">
                  {address.fullName
                    ? "Edit Shipping Address"
                    : "Add Shipping Address"}
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Shipping Address</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                      }
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <Label>District</Label>
                    <Input
                      value={address.district}
                      onChange={(e) =>
                        setAddress({ ...address, district: e.target.value })
                      }
                      placeholder="Enter district"
                    />
                  </div>

                  <div>
                    <Label>Full Address</Label>
                    <Input
                      value={address.address}
                      onChange={(e) =>
                        setAddress({ ...address, address: e.target.value })
                      }
                      placeholder="House, road, area..."
                    />
                  </div>

                  <button
                    onClick={() => setIsAddressOpen(false)}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Address
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* {isSignedIn && (
            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number (Optional for bKash)
              </label>
              <input
                type="tel"
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your phone number for bKash payment confirmation
              </p>
            </div>
          )} */}
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payment Method
            </label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={paymentMethod === "bkash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Pay with bKash
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          {isSignedIn ? (
            <button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className={`mt-4 w-full px-4 py-3 rounded text-white font-medium transition ${
                !canCheckout
                  ? "bg-gray-400 cursor-not-allowed"
                  : paymentMethod === "bkash"
                  ? "bg-pink-500 hover:bg-pink-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading
                ? "Processing..."
                : paymentMethod === "bkash"
                ? "Pay with bKash"
                : "Place Order (Cash on Delivery)"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>

        <div className="h-64 lg:h-0">
          {/* spacer for fixed checkout for mobile */}
        </div>
      </div>
    </div>
  );
};

export default BasketPage;
