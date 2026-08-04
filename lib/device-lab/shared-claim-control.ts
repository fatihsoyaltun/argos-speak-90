import type { BlockedClaim, DeviceSlug } from "./types";

const allDeviceSlugs: readonly DeviceSlug[] = [
  "8k",
  "contactless-lite",
  "tzoom-plus-dna",
  "superspectral-force-core",
  "contactless-lab-ultra",
  "high-tech-catalog",
];

export const worldFirstBlockedClaim: BlockedClaim = {
  id: "blocked-marketing-world-first",
  text: "World-first, first-and-only, or equivalent product positioning",
  affectedDevices: ["8k", "contactless-lite", "high-tech-catalog"],
  reason:
    "The presentations provide promotional superlatives without independent comparative evidence.",
  evidenceNeededToUnblock: [
    "Precisely scoped comparative claim",
    "Defined comparison set and method",
    "Independent supporting evidence",
  ],
};

export const marketingSuperlativesBlockedClaim: BlockedClaim = {
  id: "blocked-marketing-superlatives",
  text: "Strongest, unique, best, ultimate, or equivalent comparative wording",
  affectedDevices: [
    "tzoom-plus-dna",
    "superspectral-force-core",
    "contactless-lab-ultra",
    "high-tech-catalog",
  ],
  reason:
    "No comparison benchmark, test method, conditions, or independent validation is supplied.",
  evidenceNeededToUnblock: [
    "Defined comparison scope",
    "Test method and metrics",
    "Independent validation",
  ],
};

export const unnamedAccreditationBlockedClaim: BlockedClaim = {
  id: "blocked-unnamed-accreditation",
  text: "Accreditation or certification presented as a confirmed device fact without a named record",
  affectedDevices: [
    "8k",
    "contactless-lab-ultra",
    "high-tech-catalog",
  ],
  reason:
    "The available material does not name a certificate, issuing authority, device scope, or validity period.",
  evidenceNeededToUnblock: [
    "Authoritative certificate or accreditation record",
    "Named issuing authority",
    "Device model, scope, and validity",
  ],
};

export const directAfisIntegrationBlockedClaim: BlockedClaim = {
  id: "blocked-direct-afis-integration",
  text: "Direct, automatic, API-based, or certified AFIS integration",
  affectedDevices: allDeviceSlugs,
  reason:
    "The 8K source documents a manual preparation/submission workflow; no device source documents a direct interface.",
  evidenceNeededToUnblock: [
    "Interface specification",
    "Named supported AFIS systems",
    "Integration workflow and certification evidence",
  ],
};

export const performanceGuaranteesBlockedClaim: BlockedClaim = {
  id: "blocked-performance-guarantees",
  text: "Performance, accuracy, sensitivity, specificity, success-rate, or admissibility guarantees",
  affectedDevices: allDeviceSlugs,
  reason:
    "Presentation specifications and demonstrations are not validated performance datasets.",
  evidenceNeededToUnblock: [
    "Test protocol and conditions",
    "Sample size and measured results",
    "Independent validation and scoped conclusion",
  ],
};

export const unsupportedSafetyInstructionsBlockedClaim: BlockedClaim = {
  id: "blocked-unsupported-safety-instructions",
  text: "Safety instructions that are absent from the device source",
  affectedDevices: allDeviceSlugs,
  reason:
    "Only the 8K contains a narrow UVC warning; the presentations do not provide complete operating-safety procedures.",
  evidenceNeededToUnblock: [
    "Device-specific safety manual",
    "Exposure classifications and limits",
    "Approved enclosure, PPE, and emergency procedures",
  ],
};

export const tzoomDnaAnalysisBlockedClaim: BlockedClaim = {
  id: "blocked-tzoom-dna-analysis",
  text: "DNA extraction, profiling, or analysis by t-ZOOM Plus DNA",
  affectedDevices: ["tzoom-plus-dna"],
  reason:
    "The source demonstrates trace visualization/localization rather than DNA laboratory analysis.",
  evidenceNeededToUnblock: [
    "Device-specific technical documentation",
    "Validated DNA function and workflow evidence",
  ],
};

export const contactlessLiteBiologicalUsesBlockedClaim: BlockedClaim = {
  id: "blocked-contactless-lite-biological-uses",
  text: "Body-fluid, blood, GSR, or Touch-DNA use attributed to Contactless LITE",
  affectedDevices: ["contactless-lite"],
  reason:
    "These are category-level statements and are not demonstrated under the Contactless LITE device label.",
  evidenceNeededToUnblock: [
    "Contactless LITE-specific manual or datasheet",
    "Device-labeled application documentation",
    "Validated device-specific demonstrations",
  ],
};

export const superspectralSafeTransferBlockedClaim: BlockedClaim = {
  id: "blocked-superspectral-safe-transfer",
  text: "SuperSpectral SAFE content assigned to SuperSpectral Force or Core",
  affectedDevices: ["superspectral-force-core"],
  reason:
    "SuperSpectral SAFE is a separate product and its slides cannot be transferred to Force or Core.",
  evidenceNeededToUnblock: [
    "Force- or Core-specific source confirming the same capability",
  ],
};

export const catalogToDeviceTransferBlockedClaim: BlockedClaim = {
  id: "blocked-catalog-to-device-transfer",
  text: "Catalog-level or company-level claims assigned to an individual device without explicit support",
  affectedDevices: allDeviceSlugs,
  reason:
    "Catalog inventory and company/category wording do not establish device ownership.",
  evidenceNeededToUnblock: [
    "Device-specific source",
    "Explicit product/model attribution",
    "Conflict review against existing extractions",
  ],
};

export const sharedBlockedClaims: readonly BlockedClaim[] = [
  worldFirstBlockedClaim,
  marketingSuperlativesBlockedClaim,
  unnamedAccreditationBlockedClaim,
  directAfisIntegrationBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
  tzoomDnaAnalysisBlockedClaim,
  contactlessLiteBiologicalUsesBlockedClaim,
  superspectralSafeTransferBlockedClaim,
  catalogToDeviceTransferBlockedClaim,
];

export const forbiddenLearnerFacingPhrases = [
  "world's first",
  "world’s first",
  "first and only",
  "best",
  "strongest",
  "no image distortion",
  "third-level identification",
  "third level identification",
  "crime gun",
  "accredited",
  "up to 3 meters",
  "direct afis integration",
  "dna analysis",
  "dna extraction",
] as const;

