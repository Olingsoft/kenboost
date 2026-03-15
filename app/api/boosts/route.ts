import { NextRequest, NextResponse } from "next/server";
import { getFeedBoosts } from "@/lib/boost-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || "All";
  const limit = parseInt(searchParams.get("limit") || "20");
  const lastId = searchParams.get("lastId") || undefined;

  try {
    const boosts = await getFeedBoosts(category, limit, lastId);
    return NextResponse.json(boosts);
  } catch (error) {
    console.error("API Error fetching boosts:", error);
    return NextResponse.json({ error: "Failed to fetch boosts" }, { status: 500 });
  }
}
