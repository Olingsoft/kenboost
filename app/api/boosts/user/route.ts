import { NextRequest, NextResponse } from "next/server";
import { getUserBoosts } from "@/lib/boost-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const boosts = await getUserBoosts(userId);
    return NextResponse.json(boosts);
  } catch (error) {
    console.error("API Error fetching user boosts:", error);
    return NextResponse.json({ error: "Failed to fetch user boosts" }, { status: 500 });
  }
}
