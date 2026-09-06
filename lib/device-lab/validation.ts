import { forbiddenLearnerFacingPhrases } from "./shared-claim-control";
import type {
  DeviceLabDevice,
  DeviceLabModule,
  DeviceSlug,
  SourceReference,
} from "./types";

export interface DeviceLabValidationIssue {
  path: string;
  message: string;
}

export interface DeviceLabValidationResult {
  valid: boolean;
  issues: readonly DeviceLabValidationIssue[];
}

const releasableStatuses = new Set(["learner_ready", "draft_controlled"]);
const prohibitedClaimControls = new Set([
  "blocked",
  "not_enough_source_data",
  "conflict_follow_up_needed",
]);
const expectedDeviceSlugs: readonly DeviceSlug[] = [
  "8k",
  "contactless-lite",
  "tzoom-plus-dna",
  "superspectral-force-core",
  "contactless-lab-ultra",
  "high-tech-catalog",
];

const devicesAllowedLearnerModules = new Set<DeviceSlug>([
  "8k",
  "contactless-lite",
  "tzoom-plus-dna",
  "superspectral-force-core",
]);

function isCompleteSourceReference(reference: SourceReference) {
  return Boolean(
    reference.sourceFile.trim() &&
      reference.section.trim() &&
      reference.slideOrPage.trim() &&
      reference.note.trim(),
  );
}

function collectLearnerFacingText(module: DeviceLabModule) {
  return [
    module.titleTr,
    module.titleEn,
    module.moduleGoalTr,
    ...module.sourceBackedClaims.map((claim) => claim.text),
    ...module.vocabulary.flatMap((item) => [
      item.termEn,
      item.termTr,
      item.simpleDefinitionEn,
      item.simpleDefinitionTr,
      item.usageNoteTr,
    ]),
    module.listeningTextEn,
    module.listeningTaskTr,
    module.speakingPrompt.promptTr,
    module.speakingPrompt.promptEn ?? "",
    module.firstTryInstructionTr,
    module.secondTryInstructionTr,
    module.reviewTaskTr,
    module.journalPromptTr,
  ]
    .join("\n")
    .toLocaleLowerCase("en-US");
}

function validateModule(
  device: DeviceLabDevice,
  module: DeviceLabModule,
  issues: DeviceLabValidationIssue[],
) {
  const modulePath = `${device.slug}.modules.${module.id}`;

  if (module.deviceSlug !== device.slug) {
    issues.push({
      path: `${modulePath}.deviceSlug`,
      message: "Module deviceSlug does not match its registry owner.",
    });
  }

  if (module.sourceReferences.length === 0) {
    issues.push({
      path: `${modulePath}.sourceReferences`,
      message: "Every module must have at least one source reference.",
    });
  }

  module.sourceReferences.forEach((reference, index) => {
    if (!isCompleteSourceReference(reference)) {
      issues.push({
        path: `${modulePath}.sourceReferences.${index}`,
        message: "Source reference fields must all be non-empty.",
      });
    }
  });

  if (!module.claimControlNotesTr.trim()) {
    issues.push({
      path: `${modulePath}.claimControlNotesTr`,
      message: "Every module must have claim-control notes.",
    });
  }

  if (!module.speakingPrompt.claimControlNotesTr.trim()) {
    issues.push({
      path: `${modulePath}.speakingPrompt.claimControlNotesTr`,
      message: "Every speaking prompt must have claim-control notes.",
    });
  }

  if (module.speakingPrompt.forbiddenClaims.length === 0) {
    issues.push({
      path: `${modulePath}.speakingPrompt.forbiddenClaims`,
      message: "Every speaking prompt must name at least one forbidden claim.",
    });
  }

  if (module.sourceBackedClaims.length === 0) {
    issues.push({
      path: `${modulePath}.sourceBackedClaims`,
      message: "Every module must contain at least one source-backed claim.",
    });
  }

  const sourceClaimIds = new Set<string>();

  module.sourceBackedClaims.forEach((claim, index) => {
    const claimPath = `${modulePath}.sourceBackedClaims.${index}`;
    sourceClaimIds.add(claim.id);

    if (!claim.id.trim() || !claim.text.trim()) {
      issues.push({
        path: claimPath,
        message: "Every source-backed claim must have a non-empty ID and text.",
      });
    }

    if (claim.sourceReferences.length === 0) {
      issues.push({
        path: `${claimPath}.sourceReferences`,
        message: "Every source-backed claim must have a source reference.",
      });
    }

    claim.sourceReferences.forEach((reference, referenceIndex) => {
      if (!isCompleteSourceReference(reference)) {
        issues.push({
          path: `${claimPath}.sourceReferences.${referenceIndex}`,
          message: "Claim source reference fields must all be non-empty.",
        });
      }
    });

    if (releasableStatuses.has(module.releaseStatus)) {
      if (prohibitedClaimControls.has(claim.claimControlLevel)) {
        issues.push({
          path: `${claimPath}.claimControlLevel`,
          message:
            "A learner-ready or draft-controlled module cannot place a blocked, under-sourced, or conflicted claim in sourceBackedClaims.",
        });
      }

      if (!releasableStatuses.has(claim.releaseStatus)) {
        issues.push({
          path: `${claimPath}.releaseStatus`,
          message:
            "A releasable module cannot contain a deferred or blocked source-backed claim.",
        });
      }

      if (!claim.learnerFacingTextAllowed) {
        issues.push({
          path: `${claimPath}.learnerFacingTextAllowed`,
          message:
            "A claim in a releasable module must be explicitly allowed for learner-facing text.",
        });
      }
    }

    if (
      claim.productScope.kind !== "device" ||
      claim.productScope.deviceSlug !== module.deviceSlug
    ) {
      issues.push({
        path: `${claimPath}.productScope`,
        message:
          "Initial learner modules may contain only claims owned by the same device.",
      });
    }
  });

  module.blockedClaims.forEach((claim, index) => {
    if (sourceClaimIds.has(claim.id)) {
      issues.push({
        path: `${modulePath}.blockedClaims.${index}`,
        message:
          "A blocked claim must remain separate from sourceBackedClaims.",
      });
    }

    if (!claim.affectedDevices.includes(module.deviceSlug)) {
      issues.push({
        path: `${modulePath}.blockedClaims.${index}.affectedDevices`,
        message: "A module blocked claim must include the owning device.",
      });
    }
  });

  module.vocabulary.forEach((item, index) => {
    if (item.sourceReferences.length === 0) {
      issues.push({
        path: `${modulePath}.vocabulary.${index}.sourceReferences`,
        message: "Every vocabulary item must have a source reference.",
      });
    }

    item.sourceReferences.forEach((reference, referenceIndex) => {
      if (!isCompleteSourceReference(reference)) {
        issues.push({
          path: `${modulePath}.vocabulary.${index}.sourceReferences.${referenceIndex}`,
          message: "Vocabulary source reference fields must all be non-empty.",
        });
      }
    });
  });

  const learnerFacingText = collectLearnerFacingText(module);

  forbiddenLearnerFacingPhrases.forEach((phrase) => {
    if (learnerFacingText.includes(phrase.toLocaleLowerCase("en-US"))) {
      issues.push({
        path: modulePath,
        message: `Forbidden learner-facing phrase detected: ${phrase}`,
      });
    }
  });
}

export function validateDeviceLabDevices(
  devices: readonly DeviceLabDevice[],
): DeviceLabValidationResult {
  const issues: DeviceLabValidationIssue[] = [];
  const deviceSlugs = new Set<string>();
  const moduleIds = new Set<string>();

  devices.forEach((device) => {
    if (deviceSlugs.has(device.slug)) {
      issues.push({
        path: device.slug,
        message: "Device slugs must be unique.",
      });
    }
    deviceSlugs.add(device.slug);

    if (
      !devicesAllowedLearnerModules.has(device.slug) &&
      device.modules.length > 0
    ) {
      issues.push({
        path: `${device.slug}.modules`,
        message:
          "Learner modules are currently allowed only for 8K, Contactless LITE, t-ZOOM Plus DNA, and SuperSpectral Force/Core.",
      });
    }

    device.modules.forEach((module) => {
      if (moduleIds.has(module.id)) {
        issues.push({
          path: `${device.slug}.modules.${module.id}`,
          message: "Module IDs must be unique across the registry.",
        });
      }
      moduleIds.add(module.id);
      validateModule(device, module, issues);
    });
  });

  expectedDeviceSlugs.forEach((slug) => {
    if (!deviceSlugs.has(slug)) {
      issues.push({
        path: "deviceLabDevices",
        message: `Required registry device is missing: ${slug}`,
      });
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertDeviceLabDataValid(
  devices: readonly DeviceLabDevice[],
) {
  const result = validateDeviceLabDevices(devices);

  if (!result.valid) {
    const detail = result.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid Device Lab data:\n${detail}`);
  }

  return result;
}
