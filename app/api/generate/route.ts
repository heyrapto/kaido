import { NextResponse } from "next/server";
import { generateNames } from "@/app/lib/gemini";
import { filterNames } from "@/app/lib/quality";
import type { QueryType } from "@/app/lib/types";

export const runtime = "nodejs";

type Body = {
  input?: string;
  type?: QueryType;
  exclude?: string[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = body.input?.trim();
  const type = body.type;
  const exclude = Array.isArray(body.exclude) ? body.exclude : [];

  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }
  if (type !== "idea" && type !== "competitor" && type !== "seed") {
    return NextResponse.json({ error: "Invalid query type" }, { status: 400 });
  }

  try {
    const raw = await generateNames(input, type, exclude);
    const names = filterNames(raw, exclude);
    return NextResponse.json({ names });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
