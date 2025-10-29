import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} X ${select.quantity}`,
                subtitle: `${select.price * select.currency}`,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "bKash", value: "bkash" },
          { title: "Cash on Delivery", value: "cod" },
        ],
      },
      initialValue: "bkash",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    // bKash Payment Verification Fields
    defineField({
      name: "transactionId",
      title: "bKash Transaction ID",
      type: "string",
      description: "Transaction ID provided by customer from bKash payment",
    }),
    defineField({
      name: "senderNumber",
      title: "Sender Phone Number",
      type: "string",
      description: "Phone number used to send bKash payment",
    }),
    defineField({
      name: "paymentSubmittedAt",
      title: "Payment Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      description: "When the customer submitted their payment verification",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Verification Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Verification", value: "pending_verification" },
          { title: "Verified", value: "verified" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending_verification",
      description: "Status of payment verification by admin",
    }),
    defineField({
      name: "paymentVerifiedAt",
      title: "Payment Verified At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      description: "When the admin verified or rejected the payment",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({
          name: "fullName",
          title: "Full Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
          validation: (Rule) =>
            Rule.required().regex(/^01[3-9]\d{8}$/, {
              name: "valid Bangladeshi number",
              invert: false,
            }),
        }),
        defineField({
          name: "district",
          title: "District",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address",
          title: "Full Address",
          type: "text",
          validation: (Rule) => Rule.required().min(5),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "paymentNotes",
      title: "Payment Notes",
      type: "text",
      description: "Admin notes about the payment verification",
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
      paymentStatus: "paymentStatus",
      district: "shippingAddress.district", // ✅ added
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(
        0,
        5
      )}...${select.orderId.slice(-5)}`;
      const paymentStatus = select.paymentStatus
        ? ` | Payment: ${select.paymentStatus}`
        : "";
      const district = select.district ? ` | ${select.district}` : ""; // ✅ show district if available

      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency} | ${select.status}${paymentStatus}${district}`,
        media: BasketIcon,
      };
    },
  },
});
