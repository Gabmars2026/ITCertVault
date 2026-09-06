import type { CcnaCase } from "./ccna-ticket-types";
import { ccnaTicketCatalog1 } from "./ccna-ticket-catalog-1";
import { ccnaTicketCatalog2 } from "./ccna-ticket-catalog-2";
import { ccnaTicketCatalog3 } from "./ccna-ticket-catalog-3";
import { ccnaTicketCatalog4 } from "./ccna-ticket-catalog-4";

export const ccnaTicketCatalog: CcnaCase[] = [
  ...ccnaTicketCatalog1,
  ...ccnaTicketCatalog2,
  ...ccnaTicketCatalog3,
  ...ccnaTicketCatalog4,
];

if (ccnaTicketCatalog.length !== 200) {
  throw new Error(`CCNA ticket catalog expected 200 definitions, found ${ccnaTicketCatalog.length}.`);
}

if (new Set(ccnaTicketCatalog.map((item) => item.title)).size !== 200) {
  throw new Error("CCNA ticket catalog contains duplicate titles.");
}

if (new Set(ccnaTicketCatalog.map((item) => item.rootCause)).size !== 200) {
  throw new Error("CCNA ticket catalog contains duplicate root causes.");
}
