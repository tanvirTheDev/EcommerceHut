import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", req.url));
}
