import { NextResponse } from "next/server";
import { checkDomains } from "@/app/lib/domain";

export const runtime = "nodejs";

type Body = { names?: string[] };

export async function POST(req: Request) {
  if (!process.env.NINJA_API_KEY) {
    return NextResponse.json(
      { error: "NINJA_API_KEY is not set on the server" },
      { status: 500 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const names = Array.isArray(body.names)
    ? body.names.filter((n): n is string => typeof n === "string" && n.length > 0)
    : [];

  if (names.length === 0) {
    return NextResponse.json({ error: "No names provided" }, { status: 400 });
  }

  try {
    const results = await checkDomains(names);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("[availability] route failed:", err);
    const message = err instanceof Error ? err.message : "Availability check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
