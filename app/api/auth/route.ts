import { NextResponse } from "next/server";

const PIN = "6969";

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (pin !== PIN) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "rescroll_auth",
    value: "true",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
