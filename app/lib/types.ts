export type QueryType = "idea" | "competitor" | "seed";

export type DomainStatus = "checking" | "available" | "taken";

export type DomainResult = {
  name: string;
  domain: string;
  status: DomainStatus;
  available?: boolean;
};
