import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import { getMyOrders } from "@/sanity/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Orders = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const orders = await getMyOrders(userId);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 traking-tight mb-8">
          My Orders
        </h1>
        {orders.length == 0 ? (
          <div className="text-center text-gray-600">
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-bold">
                        Order Number
                      </p>
                      <p className="font-mono text-sm text-green-600 break-all">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-medium">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* status */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="text-sm mr-2">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* ✅ Payment Method */}
                      <div className="flex items-center">
                        <span className="text-sm mr-2">Payment Method:</span>
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                          {order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : "bKash"}
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-m text-gray-600 mb-1">Total Amount</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>

                  {/* discount amount */}
                  {order.amountDiscount ? (
                    <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                      <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
                        Discount Applied:{" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Original Subtotal:{" "}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + order.amountDiscount,
                          order.currency
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>
                {/* order items */}
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <p className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4">
                    Order Items
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    {order.products?.map((product) => (
                      <div
                        key={product.product?._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center gpa-3 sm:gap-4">
                          {product.product?.image && (
                            <div className="relative size-14 sm:size-16 shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={imageUrl(product.product.image).url()}
                                alt={product.product?.name || "Product image"}
                                className="object-cover"
                                fill
                              />
                            </div>
                          )}
                          {/* quantity */}
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              {product.product?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {product.quantity ?? "N/A"}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-right">
                          {product.product?.price && product.quantity
                            ? formatCurrency(
                                product.product?.price * product.quantity,
                                order.currency
                              )
                            : "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
