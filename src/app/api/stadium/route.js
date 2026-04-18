import { NextResponse } from "next/server";
import { getStadiumData } from "@/data/stadiumData";

export async function GET() {
  const data = getStadiumData();
  return NextResponse.json(data);
}
