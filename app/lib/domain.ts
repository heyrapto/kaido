export type AvailabilityCheck = {
  name: string;
  domain: string;
  available: boolean;
};

const RDAP_BASE = "https://rdap.verisign.com/com/v1/domain";
const TIMEOUT_MS = 5000;

export async function checkDomain(name: string): Promise<AvailabilityCheck> {
  const domain = `${name}.com`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${RDAP_BASE}/${domain}`, {
      headers: { Accept: "application/rdap+json" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (res.status === 404) return { name, domain, available: true };
    if (res.status === 200) return { name, domain, available: false };

    const body = await res.text().catch(() => "");
    throw new Error(`RDAP ${res.status}: ${body.slice(0, 160)}`);
  } finally {
    clearTimeout(timer);
  }
}

export async function checkDomains(names: string[]): Promise<AvailabilityCheck[]> {
  const settled = await Promise.allSettled(names.map((n) => checkDomain(n)));
  return settled.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    console.error(`[availability] ${names[i]}.com check failed:`, r.reason);
    return { name: names[i], domain: `${names[i]}.com`, available: false };
  });
}
