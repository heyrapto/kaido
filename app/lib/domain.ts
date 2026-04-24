export type AvailabilityCheck = {
  name: string;
  domain: string;
  available: boolean;
};

export async function checkDomain(name: string): Promise<AvailabilityCheck> {
  const key = process.env.NINJA_API_KEY;
  if (!key) throw new Error("NINJA_API_KEY is not set");

  const domain = `${name}.com`;
  const res = await fetch(`https://api.api-ninjas.com/v1/domain?domain=${domain}`, {
    headers: { "X-Api-Key": key },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API-Ninjas ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as { available?: boolean };
  return { name, domain, available: Boolean(data.available) };
}

export async function checkDomains(names: string[]): Promise<AvailabilityCheck[]> {
  const settled = await Promise.allSettled(names.map((n) => checkDomain(n)));
  return settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`[availability] ${names[i]}.com check failed:`, r.reason);
    return { name: names[i], domain: `${names[i]}.com`, available: false };
  });
}
