export type DeviceSlug =
  | "8k"
  | "contactless-lite"
  | "tzoom-plus-dna"
  | "superspectral-force-core"
  | "contactless-lab-ultra"
  | "high-tech-catalog";

export type EvidenceLevel =
  | "verified_technical_fact"
  | "source_stated_capability"
  | "marketing_claim"
  | "unclear_needs_verification"
  | "catalog_level_claim"
  | "company_level_claim"
  | "separate_product_out_of_scope";

export type ClaimControlLevel =
  | "safe"
  | "cautious"
  | "blocked"
  | "not_enough_source_data"
  | "conflict_follow_up_needed";

export type ReleaseStatus =
  | "learner_ready"
  | "draft_controlled"
  | "blocked"
  | "deferred";

export type ModuleKind =
  | "intro"
  | "customer_demo"
  | "workflow"
  | "light_filter"
  | "safety"
  | "export_reporting"
  | "afis_preparation"
  | "troubleshooting"
  | "comparison"
  | "final_demo";

export type ProductScope =
  | {
      kind: "device";
      deviceSlug: DeviceSlug;
    }
  | {
      kind: "family";
      deviceSlug: DeviceSlug;
      familyName: string;
    }
  | {
      kind: "company_or_category";
      label: string;
    }
  | {
      kind: "catalog";
      deviceSlug: "high-tech-catalog";
    }
  | {
      kind: "unresolved";
      label: string;
    };

export type SafetyRelevance =
  | "not_safety_instruction"
  | "descriptive_light_content"
  | "source_warning_only"
  | "blocked_missing_safety_source";

export type LearnerLevel = "A2" | "A2_B1" | "B1";

export type ExpectedOutputType =
  | "short_spoken_intro"
  | "controlled_customer_demo"
  | "source_warning_restatement"
  | "demonstration_summary";

export type SourceStrength = "strong" | "moderate" | "limited";

export interface SourceReference {
  sourceFile: string;
  section: string;
  slideOrPage: string;
  note: string;
}

export interface DeviceLabClaim {
  id: string;
  text: string;
  productScope: ProductScope;
  evidenceLevel: EvidenceLevel;
  claimControlLevel: ClaimControlLevel;
  releaseStatus: ReleaseStatus;
  sourceReferences: readonly SourceReference[];
  attributionRequired: boolean;
  learnerFacingTextAllowed: boolean;
  demonstrationOnly: boolean;
  safetyRelevance: SafetyRelevance;
  blockedReason?: string;
  missingEvidenceNeeded?: readonly string[];
}

export interface BlockedClaim {
  id: string;
  text: string;
  affectedDevices: readonly DeviceSlug[];
  reason: string;
  evidenceNeededToUnblock: readonly string[];
}

export interface DeviceLabVocabularyItem {
  id: string;
  termEn: string;
  termTr: string;
  simpleDefinitionEn: string;
  simpleDefinitionTr: string;
  claimControlLevel: ClaimControlLevel;
  sourceReferences: readonly SourceReference[];
  usageNoteTr: string;
}

export interface DeviceLabPrompt {
  id: string;
  promptTr: string;
  promptEn?: string;
  expectedOutputType: ExpectedOutputType;
  claimControlNotesTr: string;
  forbiddenClaims: readonly string[];
}

export interface DeviceLabModule {
  id: string;
  deviceSlug: DeviceSlug;
  kind: ModuleKind;
  titleTr: string;
  titleEn: string;
  learnerLevel: LearnerLevel;
  releaseStatus: ReleaseStatus;
  moduleGoalTr: string;
  sourceBackedClaims: readonly DeviceLabClaim[];
  blockedClaims: readonly BlockedClaim[];
  vocabulary: readonly DeviceLabVocabularyItem[];
  listeningTextEn: string;
  listeningTaskTr: string;
  speakingPrompt: DeviceLabPrompt;
  firstTryInstructionTr: string;
  secondTryInstructionTr: string;
  reviewTaskTr: string;
  journalPromptTr: string;
  adminCoachingSignalTr: string;
  sourceReferences: readonly SourceReference[];
  claimControlNotesTr: string;
}

export interface DeviceLabDevice {
  slug: DeviceSlug;
  productName: string;
  aliases: readonly string[];
  categoryTr: string;
  categoryEn: string;
  sourceStrength: SourceStrength;
  releaseStatus: ReleaseStatus;
  safeTrainingAreasTr: readonly string[];
  cautiousAreasTr: readonly string[];
  blockedClaims: readonly BlockedClaim[];
  missingDocumentsTr: readonly string[];
  recommendedModules: readonly ModuleKind[];
  modules: readonly DeviceLabModule[];
}

