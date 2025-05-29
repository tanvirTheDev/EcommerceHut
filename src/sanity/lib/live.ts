// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity";
import "server-only";
import { client } from "./client";

// set viewer token
const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("SANITY_API_TOKEN is not defined");
}

export const { sanityFetch, SanityLive } = defineLive({
  // Live content is currently only available on the experimental API
  // https://www.sanity.io/docs/api-versioning
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: {
    revalidate: 0,
  },
});
