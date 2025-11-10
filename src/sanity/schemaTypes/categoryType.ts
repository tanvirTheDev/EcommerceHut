import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "isCustomizable",
      title: "Is Customizable?",
      type: "boolean",
      description: "Check this if products in this category are customizable",
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});
