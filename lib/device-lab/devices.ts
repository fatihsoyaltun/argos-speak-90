import { eightKModules } from "./8k";
import {
  contactlessLiteFourKBlockedClaim,
  contactlessLiteModules,
  contactlessLiteSpectralRangeBlockedClaim,
  contactlessLiteUnsupportedSoftwareBlockedClaim,
} from "./contactless-lite";
import {
  catalogToDeviceTransferBlockedClaim,
  contactlessLiteBiologicalUsesBlockedClaim,
  directAfisIntegrationBlockedClaim,
  marketingSuperlativesBlockedClaim,
  performanceGuaranteesBlockedClaim,
  superspectralSafeTransferBlockedClaim,
  tzoomDnaAnalysisBlockedClaim,
  unnamedAccreditationBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
  worldFirstBlockedClaim,
} from "./shared-claim-control";
import {
  superspectralAmbiguousApplicationSlidesBlockedClaim,
  superspectralBatteryRuntimeBlockedClaim,
  superspectralCoreLensCompatibilityBlockedClaim,
  superspectralForceCoreModules,
  superspectralUndocumentedSoftwareBlockedClaim,
} from "./superspectral-force-core";
import {
  tzoomApplicationDemoBlockedClaim,
  tzoomBareSlideAttributionBlockedClaim,
  tzoomContactlessCompanyLevelBlockedClaim,
  tzoomPlusDnaModules,
  tzoomUnclearFunctionsBlockedClaim,
} from "./tzoom-plus-dna";
import type {
  DeviceLabClaim,
  DeviceLabDevice,
  DeviceLabModule,
  DeviceSlug,
} from "./types";
import { assertDeviceLabDataValid } from "./validation";

export const deviceLabDevices: readonly DeviceLabDevice[] = [
  {
    slug: "8k",
    productName: "8K Latent Fingerprint Detection Tablet",
    aliases: ["8K", "8K mobile compact system", "8K System"],
    categoryTr: "Gizli parmak izi tespit ve görüntüleme sistemi",
    categoryEn: "Latent fingerprint detection and imaging system",
    sourceStrength: "strong",
    releaseStatus: "learner_ready",
    safeTrainingAreasTr: [
      "Kontrollü ürün tanıtımı",
      "45.9MP kamera ve UV/VIS/IR vocabulary",
      "Kaynak atıflı contactless ve powder/chemical-free workflow dili",
      "Kaynakta listelenen capture, export, archive ve reporting vocabulary",
      "Dar kapsamlı UVC source warning",
    ],
    cautiousAreasTr: [
      "Contactless ve powder/chemical-free ifadelerinde üretici atfı",
      "Yedi named filter ile overview'daki sekiz-filter conflict'i",
      "Manual AFIS preparation/submission dili",
      "Presentation demonstrations ve case-specific reporting",
    ],
    blockedClaims: [
      worldFirstBlockedClaim,
      performanceGuaranteesBlockedClaim,
      unnamedAccreditationBlockedClaim,
      directAfisIntegrationBlockedClaim,
      unsupportedSafetyInstructionsBlockedClaim,
      catalogToDeviceTransferBlockedClaim,
    ],
    missingDocumentsTr: [
      "Operator manual ve surface-specific settings",
      "Tam teknik datasheet",
      "UVC safety/compliance belgesi",
      "AFIS preparation/integration dokümantasyonu",
      "Named accreditation/certification kaydı",
      "Validation ve performance verisi",
    ],
    recommendedModules: ["intro", "customer_demo", "safety"],
    modules: eightKModules,
  },
  {
    slug: "contactless-lite",
    productName: "Contactless LITE",
    aliases: [
      "Contactless LITE Evidence Imaging System",
      "CONTACTLESS LITE",
      "Contactless Lite",
    ],
    categoryTr:
      "Yansıtıcı yüzeylerde non-contact fingerprint/evidence imaging cihazı",
    categoryEn:
      "Non-contact fingerprint and evidence imaging device for reflective surfaces",
    sourceStrength: "moderate",
    releaseStatus: "learner_ready",
    safeTrainingAreasTr: [
      "Kontrollü ürün tanıtımı",
      "32.5MP CMOS ve RAW vocabulary",
      "White, Blue, Green ve Red LED groups",
      "Kaynak atıflı 20cm–5m range dili",
      "Device-labeled reflective/hard-surface demonstrations",
    ],
    cautiousAreasTr: [
      "Range bilgisinin guaranteed field result olmaması",
      "Contactless ifadesinin manufacturer-stated capability olarak kullanılması",
      "Demonstration örneklerinin validation sayılmaması",
      "Multispectral kelimesinden wavelength çıkarılmaması",
    ],
    blockedClaims: [
      worldFirstBlockedClaim,
      contactlessLiteBiologicalUsesBlockedClaim,
      contactlessLiteUnsupportedSoftwareBlockedClaim,
      contactlessLiteFourKBlockedClaim,
      contactlessLiteSpectralRangeBlockedClaim,
      performanceGuaranteesBlockedClaim,
      unsupportedSafetyInstructionsBlockedClaim,
      catalogToDeviceTransferBlockedClaim,
    ],
    missingDocumentsTr: [
      "User manual ve step-by-step capture workflow",
      "Tam teknik datasheet ve LED wavelength bands",
      "LED/electrical safety belgesi",
      "Software/export/reporting dokümantasyonu",
      "SOP ve surface-specific validated settings",
      "Validation/performance verisi",
    ],
    recommendedModules: ["intro", "customer_demo"],
    modules: contactlessLiteModules,
  },
  {
    slug: "tzoom-plus-dna",
    productName: "t-ZOOM Plus DNA",
    aliases: ["t-ZOOM PLUS DNA", "t-ZOOM+", "t ZOOM PLUS DNA"],
    categoryTr:
      "Trace visualization için sunumda DNA LAB sistemi olarak konumlandırılan multispectral forensic imaging sistemi",
    categoryEn:
      "Multispectral forensic imaging system positioned for trace visualization",
    sourceStrength: "moderate",
    releaseStatus: "draft_controlled",
    safeTrainingAreasTr: [
      "Kontrollü ürün tanıtımı",
      "Component, lens, ring-light ve filter vocabulary",
      "UV/VIS/IR ve software/connectivity vocabulary",
      "Device-labeled visualization examples",
    ],
    cautiousAreasTr: [
      "Bare t-ZOOM slide attribution",
      "Contactless/no-chemical company-level wording",
      "6 meters to 600 microns, AUTO Search ve Smart Button anlamı",
    ],
    blockedClaims: [
      tzoomDnaAnalysisBlockedClaim,
      marketingSuperlativesBlockedClaim,
      performanceGuaranteesBlockedClaim,
      unsupportedSafetyInstructionsBlockedClaim,
      directAfisIntegrationBlockedClaim,
      catalogToDeviceTransferBlockedClaim,
      tzoomBareSlideAttributionBlockedClaim,
      tzoomUnclearFunctionsBlockedClaim,
      tzoomContactlessCompanyLevelBlockedClaim,
      tzoomApplicationDemoBlockedClaim,
    ],
    missingDocumentsTr: [
      "User/operator manual",
      "Teknik datasheet",
      "UV/IR safety belgesi",
      "Product/version attribution clarification",
      "DNA function validation evidence",
      "SOP ve performance verisi",
    ],
    recommendedModules: ["intro", "light_filter", "customer_demo"],
    modules: tzoomPlusDnaModules,
  },
  {
    slug: "superspectral-force-core",
    productName: "SuperSpectral Force / SuperSpectral Core",
    aliases: [
      "SuperSpectral Force",
      "SUPERSPECTRAL FORCE",
      "SuperSpectral Core",
      "SUPERSPECTRAL CORE",
    ],
    categoryTr:
      "Force ve Core olarak ayrı SKU'ları bulunan mobile forensic imaging sistem ailesi",
    categoryEn:
      "Mobile forensic imaging system family with separate Force and Core SKUs",
    sourceStrength: "moderate",
    releaseStatus: "draft_controlled",
    safeTrainingAreasTr: [
      "Force/Core kimlik ve printed-spec comparison",
      "Sensor, storage, display, light-system ve filter vocabulary",
      "Family-level manufacturer demonstration language",
    ],
    cautiousAreasTr: [
      "Ambiguous Force/Core application ownership",
      "Force optional-lens capability ve Core compatibility boşluğu",
      "Light-system descriptions arasındaki unresolved ilişki",
    ],
    blockedClaims: [
      superspectralSafeTransferBlockedClaim,
      marketingSuperlativesBlockedClaim,
      performanceGuaranteesBlockedClaim,
      unsupportedSafetyInstructionsBlockedClaim,
      directAfisIntegrationBlockedClaim,
      catalogToDeviceTransferBlockedClaim,
      superspectralAmbiguousApplicationSlidesBlockedClaim,
      superspectralCoreLensCompatibilityBlockedClaim,
      superspectralUndocumentedSoftwareBlockedClaim,
      superspectralBatteryRuntimeBlockedClaim,
    ],
    missingDocumentsTr: [
      "Force ve Core operator manuals",
      "UV/IR safety/compliance belgesi",
      "Application slide attribution",
      "Core optional-lens compatibility belgesi",
      "Software/case-management dokümantasyonu",
      "Validation/performance verisi",
    ],
    recommendedModules: ["intro", "comparison", "light_filter"],
    modules: superspectralForceCoreModules,
  },
  {
    slug: "contactless-lab-ultra",
    productName: "Contactless LAB ULTRA",
    aliases: ["CONTACTLESS LAB ULTRA"],
    categoryTr: "Laboratuvar incelemeleri için multispectral imaging sistemi",
    categoryEn: "Multispectral imaging system for laboratory investigations",
    sourceStrength: "moderate",
    releaseStatus: "deferred",
    safeTrainingAreasTr: [
      "Kontrollü kimlik ve component vocabulary",
      "In-light, out-light, filter ve control-panel vocabulary",
      "Optional accessory ve device-labeled demonstration dili",
    ],
    cautiousAreasTr: [
      "UV365 printed wording",
      "Capture One/laptop/mouse/keyboard optional status",
      "NJSP brand-level reference ve eksik device attribution",
    ],
    blockedClaims: [
      marketingSuperlativesBlockedClaim,
      unnamedAccreditationBlockedClaim,
      performanceGuaranteesBlockedClaim,
      unsupportedSafetyInstructionsBlockedClaim,
      directAfisIntegrationBlockedClaim,
      catalogToDeviceTransferBlockedClaim,
    ],
    missingDocumentsTr: [
      "User manual ve light/filter procedure",
      "Camera/lens/filter/wavelength datasheet",
      "UV/light safety belgesi",
      "Software/reporting workflow",
      "NJSP source ve accreditation evidence",
      "Validation/performance verisi",
    ],
    recommendedModules: ["intro", "light_filter", "customer_demo"],
    modules: [],
  },
  {
    slug: "high-tech-catalog",
    productName: "High-Tech Forensic Imaging Solutions overview",
    aliases: ["High-Tech catalog overview"],
    categoryTr: "Internal catalog inventory ve conflict-review kaynağı",
    categoryEn: "Internal catalog inventory and conflict-review source",
    sourceStrength: "limited",
    releaseStatus: "blocked",
    safeTrainingAreasTr: [
      "Internal product inventory",
      "Naming variant ve attribution-boundary review",
      "Cross-source conflict discovery",
    ],
    cautiousAreasTr: [
      "Summary-only extraction",
      "Catalog version/naming differences",
      "8K filter ve Contactless LITE video conflicts",
    ],
    blockedClaims: [
      catalogToDeviceTransferBlockedClaim,
      worldFirstBlockedClaim,
      marketingSuperlativesBlockedClaim,
      unnamedAccreditationBlockedClaim,
      performanceGuaranteesBlockedClaim,
    ],
    missingDocumentsTr: [
      "Tam structured catalog extraction",
      "Original overview presentation",
      "Catalog date/version history",
      "Name-only products için device-specific sources",
      "Filter/video/naming/accreditation reconciliation evidence",
    ],
    recommendedModules: [],
    modules: [],
  },
];

export const deviceLabValidationResult =
  assertDeviceLabDataValid(deviceLabDevices);

export function getDeviceLabDevice(slug: DeviceSlug) {
  return deviceLabDevices.find((device) => device.slug === slug);
}

export function getDeviceLabModules(slug: DeviceSlug) {
  return getDeviceLabDevice(slug)?.modules ?? [];
}

export function getLearnerReadyDeviceLabModules(slug: DeviceSlug) {
  return getDeviceLabModules(slug).filter(
    (module) => module.releaseStatus === "learner_ready",
  );
}

export const learnerReadyDeviceLabDevices = deviceLabDevices.filter((device) =>
  device.modules.some((module) => module.releaseStatus === "learner_ready"),
);

export function getLearnerReadyDeviceLabDevice(slug: string) {
  return learnerReadyDeviceLabDevices.find((device) => device.slug === slug);
}

export function getDeviceLabModuleIntro(module: DeviceLabModule) {
  const text = module.listeningTextEn.trim();
  const firstSentence = text.match(/^.*?[.!?](?=\s|$)/)?.[0];

  return firstSentence ?? text;
}

function isLearnerReadyClaim(claim: DeviceLabClaim) {
  return (
    claim.releaseStatus === "learner_ready" &&
    claim.learnerFacingTextAllowed &&
    claim.claimControlLevel !== "blocked" &&
    claim.claimControlLevel !== "not_enough_source_data" &&
    claim.claimControlLevel !== "conflict_follow_up_needed"
  );
}

export function getDeviceLabQuickFacts(module: DeviceLabModule) {
  const learnerClaims = module.sourceBackedClaims.filter(isLearnerReadyClaim);
  const introClaimId = learnerClaims[0]?.id;

  return learnerClaims
    .filter((claim) => claim.id !== introClaimId)
    .slice(0, 3);
}
