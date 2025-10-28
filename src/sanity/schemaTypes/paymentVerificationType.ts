import { defineType } from "sanity";

export default defineType({
  name: "paymentVerification",
  title: "Payment Verification",
  type: "document",
  fields: [
    {
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "transactionId",
      title: "Transaction ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "senderNumber",
      title: "Sender Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "amount",
      title: "Amount",
      type: "number",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Verification", value: "pending_verification" },
          { title: "Verified", value: "verified" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending_verification",
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "verifiedAt",
      title: "Verified At",
      type: "datetime",
    },
    {
      name: "notes",
      title: "Admin Notes",
      type: "text",
      description: "Internal notes for verification process",
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "customerName",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      return {
        title: `Order: ${title}`,
        subtitle: `${subtitle} - ${status}`,
      };
    },
  },
});
