export type AvailabilityCheck = {
  name: string;
  domain: string;
  /** When false, RDAP did not return a definitive answer — do not treat as taken. */
  verified: boolean;
  /** Only meaningful when `verified` is true. */
  available: boolean;
};

const RDAP_BASE = "https://rdap.verisign.com/com/v1/domain";
const TIMEOUT_FIRST_MS = 5000;
const TIMEOUT_RETRY_MS = 9000;
const RETRY_DELAY_MS = 400;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function checkDomainOnce(name: string, timeoutMs: number): Promise<AvailabilityCheck> {
  const domain = `${name}.com`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${RDAP_BASE}/${domain}`, {
      headers: { Accept: "application/rdap+json" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (res.status === 404) return { name, domain, verified: true, available: true };
    if (res.status === 200) return { name, domain, verified: true, available: false };

    const body = await res.text().catch(() => "");
    throw new Error(`RDAP ${res.status}: ${body.slice(0, 160)}`);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolves with a definite available/taken result when RDAP responds, or
 * `{ verified: false }` after one retry so slow/unreachable registry is not shown as "taken".
 */
export async function checkDomain(name: string): Promise<AvailabilityCheck> {
  try {
    return await checkDomainOnce(name, TIMEOUT_FIRST_MS);
  } catch (firstErr) {
    console.warn(`[availability] ${name}.com first attempt failed, retrying…`, firstErr);
    await sleep(RETRY_DELAY_MS);
    try {
      return await checkDomainOnce(name, TIMEOUT_RETRY_MS);
    } catch (err) {
      console.error(`[availability] ${name}.com check failed after retry:`, err);
      return {
        name,
        domain: `${name}.com`,
        verified: false,
        available: false,
      };
    }
  }
}

export async function checkDomains(names: string[]): Promise<AvailabilityCheck[]> {
  return Promise.all(names.map((n) => checkDomain(n)));
}
