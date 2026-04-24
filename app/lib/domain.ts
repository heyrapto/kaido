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
    throw new Error(`API-Ninjas returned ${res.status}`);
  }

  const data = (await res.json()) as { available?: boolean };
  return { name, domain, available: Boolean(data.available) };
}

export async function checkDomains(names: string[]): Promise<AvailabilityCheck[]> {
  return Promise.all(names.map((n) => checkDomain(n)));
}
