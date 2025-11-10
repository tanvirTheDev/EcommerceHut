// @typescript-eslint/no-unused-var
import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import { getMyOrders } from "@/sanity/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Package,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const statusStyles = {
  pending: {
    label: "Pending",
    bg: "bg-orange-100",
    text: "text-orange-800",
    icon: Clock,
  },
  paid: {
    label: "Paid",
    bg: "bg-green-100",
    text: "text-green-800",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    bg: "bg-green-100",
    text: "text-green-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
  },
} as const;

const formatDate = (input?: string) => {
  if (!input) return "N/A";
  try {
    return new Date(input).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const Orders = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const orders = await getMyOrders(userId);

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600">
                  <Package className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                    My Orders
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Track your purchases, deliveries, and payment status all in
                    one place.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Total Orders
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  {orders.length}
                </p>
              </div>
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Delivered / Paid
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {
                    orders.filter(
                      (order) =>
                        order.status === "paid" || order.status === "delivered"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </header>

        {orders.length === 0 ? (
          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm py-16 sm:py-20 px-6 sm:px-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Package className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-600 max-w-md mb-6">
              You haven&apos;t placed any orders yet. Browse our collection and
              find products that fit your style.
            </p>

            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </section>
        ) : (
          <section className="space-y-6 sm:space-y-8">
            {orders.map((order) => {
              const status = order.status || "pending";
              const statusConfig =
                statusStyles[status as keyof typeof statusStyles] ||
                statusStyles.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <article
                  key={order.orderNumber}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Order summary header */}
                  <div className="bg-linear-to-r from-blue-50 via-white to-gray-50 px-4 sm:px-6 lg:px-8 py-5 border-b border-gray-200">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Order
                          </span>
                          <span className="font-mono text-sm sm:text-base font-bold text-blue-600">
                            #{order.orderNumber}
                          </span>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(order.orderDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">
                              {order.paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "bKash"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left lg:text-right">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Order Total
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(
                            order.totalPrice ?? 0,
                            order.currency
                          )}
                        </p>
                      </div>
                    </div>

                    {order.amountDiscount && order.amountDiscount > 0 ? (
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-sm font-semibold text-orange-700">
                        <Tag className="w-4 h-4" />
                        Discount applied:{" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </div>
                    ) : null}
                  </div>

                  {/* Order items */}
                  <div className="px-4 sm:px-6 lg:px-8 py-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      Order Items ({order.products?.length || 0})
                    </h3>

                    <div className="space-y-4">
                      {order.products?.map((lineItem) => {
                        const product = lineItem.product;
                        const image = product?.image;
                        const lineTotal =
                          product?.price && lineItem.quantity
                            ? formatCurrency(
                                product.price * lineItem.quantity,
                                order.currency
                              )
                            : "N/A";

                        return (
                          <div
                            key={product?._id || lineItem._key}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="w-full sm:w-auto">
                              {image ? (
                                <div className="relative w-full sm:w-32 md:w-36 lg:w-40 aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                  <Image
                                    src={imageUrl(image).url()}
                                    alt={product?.name || "Product image"}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 128px, 160px"
                                    className="object-cover"
                                  />
                                  {lineItem.quantity &&
                                  lineItem.quantity > 1 ? (
                                    <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                                      &times;{lineItem.quantity}
                                    </span>
                                  ) : null}
                                </div>
                              ) : (
                                <div className="w-full sm:w-32 md:w-36 lg:w-40 h-32 sm:h-36 lg:h-40 flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-gray-400">
                                  <Package className="w-10 h-10" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-gray-900 truncate">
                                {product?.name || "Unnamed product"}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                                  Quantity: {lineItem.quantity ?? "N/A"}
                                </span>
                                {product?.price ? (
                                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                    Unit:{" "}
                                    {formatCurrency(
                                      product.price,
                                      order.currency
                                    )}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                Item Total
                              </p>
                              <p className="text-lg font-semibold text-blue-600">
                                {lineTotal}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {order.amountDiscount && order.amountDiscount > 0 ? (
                        <div className="text-sm text-gray-600">
                          <span className="mr-2">Original subtotal:</span>
                          <span className="line-through text-gray-400">
                            {formatCurrency(
                              (order.totalPrice ?? 0) + order.amountDiscount,
                              order.currency
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          <span>Thank you for shopping with EcommerceHut.</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="text-base font-semibold text-gray-900">
                          Final Total
                        </span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatCurrency(
                            order.totalPrice ?? 0,
                            order.currency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default Orders;
