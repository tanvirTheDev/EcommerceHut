// src/app/api/draft-mode/enable/route.ts

// import { client } from "@/sanity/lib/client";
// import { defineEnableDraftMode } from "next-sanity/draft-mode";

// export const { GET } = defineEnableDraftMode({
//   client: client.withConfig({
//     token: process.env.SANITY_VIEWER_TOKEN,
//   }),
// });
import { client } from "@/sanity/lib/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const token = process.env.SANITY_API_READ_TOKEN;

export async function GET(req: Request) {
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    client.withConfig({ token }),
    req.url
  );
  if (!isValid) {
    return new Response("Invalid Secret", { status: 401 });
  }
  (await draftMode()).enable();
  redirect(redirectTo);
}
