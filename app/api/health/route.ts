import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "portfolio",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    siteUrl: getSiteUrl(),
    timestamp: new Date().toISOString(),
  });
}
