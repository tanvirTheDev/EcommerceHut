import { TagIcon } from "@sanity/icons";
import { defineType } from "sanity";

export const salesType = defineType({
  name: "sales",
  title: "Sales",
  type: "document",
  icon: TagIcon,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Sale Title",
    },
    {
      name: "description",
      type: "text",
      title: "Sale Description",
    },
    {
      name: "discountAmount",
      type: "number",
      title: "Discount Amount",
      description: "Amount off in percentage or fixed value",
    },
    {
      name: "couponCode",
      type: "string",
      title: "Coupon Code",
    },
    {
      name: "validFrom",
      type: "datetime",
      title: "Valid From",
    },
    {
      name: "validUntil",
      type: "datetime",
      title: "Valid Until",
    },
    {
      name: "isActive",
      type: "boolean",
      title: "Is Active",
      description: "Toggle to activate/deactivate the sale",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      discountAmount: "discountAmount",
      couponCode: "couponCode",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, discountAmount, couponCode, isActive } = selection;
      const status = isActive ? "Active" : "Inactive";
      return {
        title,
        subtitle: `${discountAmount} % off - code: ${couponCode} - (${status})`,
      };
    },
  },
});
