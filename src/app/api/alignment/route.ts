import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      error: `Not implemented`,
    },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: `Not implemented`,
    },
    { status: 500 }
  );
}
