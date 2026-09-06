import {
  catalogToDeviceTransferBlockedClaim,
  directAfisIntegrationBlockedClaim,
  marketingSuperlativesBlockedClaim,
  performanceGuaranteesBlockedClaim,
  superspectralSafeTransferBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
} from "./shared-claim-control";
import type {
  BlockedClaim,
  DeviceLabClaim,
  DeviceLabModule,
  ProductScope,
  SourceReference,
} from "./types";

const superspectralScope: ProductScope = {
  kind: "device",
  deviceSlug: "superspectral-force-core",
};

const superspectralIdentityReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "2. Product Identity",
  slideOrPage: "Slides 4 and 8",
  note:
    "Two separate SKUs — SuperSpectral Force and SuperSpectral Core — in one family line, kept as separate specifications.",
};

const superspectralSensorReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slides 5 and 9",
  note: "Force 200MP sensor versus Core 64MP sensor.",
};

const superspectralSpectralRangeReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slides 5 and 9",
  note: "Shared 330-1100nm UV/VIS/IR spectral range printed for both SKUs.",
};

const superspectralStorageDisplayReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slides 5 and 9",
  note: "Force 6.8-inch display / 1TB storage versus Core 6.9-inch display / 256GB storage.",
};

const superspectralImagingFeaturesReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slides 5 and 9",
  note:
    "4K video, RAW imaging, continuous autofocus, and 10x zoom shared by both SKUs; the source states the zoom is digital, not optical.",
};

const superspectralFilterReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "4. Hardware / Imaging / Optics / Sensors",
  slideOrPage: "Slides 7 and 11",
  note: "Twelve named Force filters versus nine named Core filters.",
};

const superspectralLightSystemReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "4. Hardware / Imaging / Optics / Sensors",
  slideOrPage: "Slides 6, 10, and 13",
  note:
    "Force uses a 'Macro Micro Lens' with Top/Spot/Oblique light groups; Core uses a 'Power Lens' with IN/OUT light groups.",
};

const superspectralOptionalLensReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slides 12, 14, and 15",
  note:
    "Force-attributed optional IR Anti-Stokes Lens and Contactless Lens; no Core component slide confirms compatibility.",
};

export const superspectralAmbiguousApplicationSlidesBlockedClaim: BlockedClaim =
  {
    id: "blocked-superspectral-ambiguous-application-slides",
    text:
      "Application demonstration slides 17-29 (blood, semen, GSR, drugs, accelerant, document, bruise, fingerprint, currency) attributed to only Force or only Core",
    affectedDevices: ["superspectral-force-core"],
    reason:
      "The slides carry no per-device label identifying which SKU produced each demonstration image.",
    evidenceNeededToUnblock: [
      "Device-labeled application slides or manual naming Force or Core specifically",
    ],
  };

export const superspectralCoreLensCompatibilityBlockedClaim: BlockedClaim = {
  id: "blocked-superspectral-core-lens-compatibility",
  text:
    "Core compatibility with the Force-attributed IR Anti-Stokes Lens or Contactless Lens",
  affectedDevices: ["superspectral-force-core"],
  reason:
    "No \"Components of SuperSpectral Core\" slide exists, so Core's compatibility with these optional lenses is unconfirmed.",
  evidenceNeededToUnblock: [
    "Core-specific datasheet or component list confirming lens compatibility",
  ],
};

export const superspectralUndocumentedSoftwareBlockedClaim: BlockedClaim = {
  id: "blocked-superspectral-undocumented-software",
  text: "Case Management System and Illuminated Darkroom functionality",
  affectedDevices: ["superspectral-force-core"],
  reason:
    "Both are named only as a listed component, with no screenshots, workflow, or further description anywhere in the source.",
  evidenceNeededToUnblock: [
    "Software/user manual describing the Case Management System and Illuminated Darkroom",
  ],
};

export const superspectralBatteryRuntimeBlockedClaim: BlockedClaim = {
  id: "blocked-superspectral-battery-runtime",
  text:
    "Battery capacity and runtime as a guaranteed operating figure",
  affectedDevices: ["superspectral-force-core"],
  reason:
    "The source states a runtime estimate with no test conditions given.",
  evidenceNeededToUnblock: [
    "Technical datasheet with tested battery runtime conditions",
  ],
};

export const superspectralIdentityClaim: DeviceLabClaim = {
  id: "superspectral-identity-two-skus",
  text:
    "The source lists two separate SKUs in the SuperSpectral family, SuperSpectral Force and SuperSpectral Core, both described as a mobile forensic imaging system.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralIdentityReference],
  attributionRequired: false,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const superspectralSensorComparisonClaim: DeviceLabClaim = {
  id: "superspectral-sensor-comparison",
  text:
    "The source lists a 200-megapixel sensor for Force and a 64-megapixel sensor for Core.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralSensorReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const superspectralSpectralRangeClaim: DeviceLabClaim = {
  id: "superspectral-shared-spectral-range",
  text:
    "The source lists a shared 330 to 1100 nanometer UV, visible, and infrared spectral range for both Force and Core.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralSpectralRangeReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
};

export const superspectralStorageDisplayClaim: DeviceLabClaim = {
  id: "superspectral-storage-display-comparison",
  text:
    "The source lists Force with a 6.8-inch display and 1TB storage, and Core with a 6.9-inch display and 256GB storage.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralStorageDisplayReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const superspectralImagingFeaturesClaim: DeviceLabClaim = {
  id: "superspectral-imaging-features",
  text:
    "The source lists 4K video, RAW imaging, continuous autofocus, and a 10x digital zoom for both Force and Core.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralImagingFeaturesReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const superspectralFilterComparisonClaim: DeviceLabClaim = {
  id: "superspectral-filter-comparison",
  text:
    "The source lists twelve named motorized filters for Force and nine named motorized filters for Core.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralFilterReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
};

export const superspectralLightSystemComparisonClaim: DeviceLabClaim = {
  id: "superspectral-light-system-comparison",
  text:
    "The source describes Force's light system as a Macro Micro Lens with Top, Spot, and Oblique groups, and Core's light system as a separate Power Lens with IN and OUT groups.",
  productScope: superspectralScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralLightSystemReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
  missingEvidenceNeeded: [
    "Clarification of how the Force slide-6 light-group lists relate to the slide-13 ring-light counts",
  ],
};

export const superspectralForceOptionalLensClaim: DeviceLabClaim = {
  id: "superspectral-force-optional-lenses",
  text:
    "The source lists two Force-attributed optional lenses, an IR Anti-Stokes Lens and a Contactless Lens; the source does not confirm whether Core supports either lens.",
  productScope: superspectralScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [superspectralOptionalLensReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Core optional-lens compatibility documentation",
    "Independent validation of lens performance",
  ],
};

const superspectralComparisonBlockedClaims = [
  marketingSuperlativesBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
  directAfisIntegrationBlockedClaim,
  catalogToDeviceTransferBlockedClaim,
  superspectralSafeTransferBlockedClaim,
  superspectralAmbiguousApplicationSlidesBlockedClaim,
  superspectralCoreLensCompatibilityBlockedClaim,
  superspectralUndocumentedSoftwareBlockedClaim,
  superspectralBatteryRuntimeBlockedClaim,
] as const;

export const superspectralForceCoreModules: readonly DeviceLabModule[] = [
  {
    id: "superspectral-force-core-comparison",
    deviceSlug: "superspectral-force-core",
    kind: "comparison",
    titleTr: "SuperSpectral Force/Core Karşılaştırması",
    titleEn: "SuperSpectral Force/Core Comparison",
    learnerLevel: "B1",
    releaseStatus: "learner_ready",
    moduleGoalTr:
      "Force ve Core'u ayrı SKU olarak koruyarak yalnız kaynakta basılı sensör, spektral aralık, filtre ve ışık sistemi farklarını kontrollü İngilizceyle karşılaştırmak.",
    sourceBackedClaims: [
      superspectralIdentityClaim,
      superspectralSensorComparisonClaim,
      superspectralSpectralRangeClaim,
      superspectralStorageDisplayClaim,
      superspectralImagingFeaturesClaim,
      superspectralFilterComparisonClaim,
      superspectralLightSystemComparisonClaim,
      superspectralForceOptionalLensClaim,
    ],
    blockedClaims: superspectralComparisonBlockedClaims,
    vocabulary: [
      {
        id: "superspectral-vocab-sku",
        termEn: "SKU",
        termTr: "ürün modeli (SKU)",
        simpleDefinitionEn:
          "A separate named product model in the same family, such as Force or Core.",
        simpleDefinitionTr:
          "Force veya Core gibi aynı ailede ayrı adlandırılmış ürün modeli.",
        claimControlLevel: "safe",
        sourceReferences: [superspectralIdentityReference],
        usageNoteTr: "Force ve Core'u aynı ürünmüş gibi birleştirme.",
      },
      {
        id: "superspectral-vocab-sensor-resolution",
        termEn: "sensor resolution",
        termTr: "sensör çözünürlüğü",
        simpleDefinitionEn:
          "The megapixel spec listed in the source for each SKU's camera sensor.",
        simpleDefinitionTr:
          "Kaynakta her SKU'nun kamera sensörü için listelenen megapiksel değeri.",
        claimControlLevel: "safe",
        sourceReferences: [superspectralSensorReference],
        usageNoteTr: "Görüntü kalitesi veya tespit performansı iması ekleme.",
      },
      {
        id: "superspectral-vocab-digital-zoom",
        termEn: "digital zoom",
        termTr: "dijital zoom",
        simpleDefinitionEn:
          "The source-stated 10x zoom, explicitly digital rather than optical.",
        simpleDefinitionTr:
          "Kaynakta belirtilen, optik değil dijital olan 10x zoom.",
        claimControlLevel: "cautious",
        sourceReferences: [superspectralImagingFeaturesReference],
        usageNoteTr: "Optik zoom ile karıştırma; kaynak ayrımını koru.",
      },
      {
        id: "superspectral-vocab-motorized-filter",
        termEn: "motorized filter",
        termTr: "motorlu filtre",
        simpleDefinitionEn:
          "One of the named filters in Force's twelve-filter or Core's nine-filter system.",
        simpleDefinitionTr:
          "Force'un on iki veya Core'un dokuz filtrelik sisteminde listelenen filtrelerden biri.",
        claimControlLevel: "safe",
        sourceReferences: [superspectralFilterReference],
        usageNoteTr: "Filtre sayısını Force ve Core arasında karıştırma.",
      },
      {
        id: "superspectral-vocab-optional-lens",
        termEn: "optional lens",
        termTr: "isteğe bağlı lens",
        simpleDefinitionEn:
          "A Force-attributed accessory lens, such as the IR Anti-Stokes Lens or Contactless Lens.",
        simpleDefinitionTr:
          "IR Anti-Stokes Lens veya Contactless Lens gibi Force'a atfedilen isteğe bağlı aksesuar lens.",
        claimControlLevel: "cautious",
        sourceReferences: [superspectralOptionalLensReference],
        usageNoteTr: "Core'un bu lensleri desteklediğini söyleme.",
      },
    ],
    listeningTextEn:
      "This is the SuperSpectral family. The source lists two separate SKUs: SuperSpectral Force and SuperSpectral Core. Force lists a 200-megapixel sensor and Core lists a 64-megapixel sensor, and both share a 330 to 1100 nanometer UV, visible, and infrared range. The source lists 4K video, RAW imaging, and a 10x digital zoom for both. Force lists twelve motorized filters and Core lists nine, and the source keeps their light systems and optional lenses separate.",
    listeningTaskTr:
      "Force ve Core arasındaki dört farkı ayır: sensör, depolama/ekran, filtre sayısı ve ışık sistemi adı.",
    speakingPrompt: {
      id: "superspectral-comparison-speaking",
      promptTr:
        "Force ve Core'u 3–4 kısa İngilizce cümleyle karşılaştır. Yalnız kaynakta basılı sensör, spektral aralık ve filtre sayılarını kullan; isteğe bağlı lensleri Core'a atfetme.",
      promptEn:
        "Compare Force and Core in three or four short sentences using only the printed sensor, spectral-range, and filter numbers, and keep the optional lenses attributed to Force only.",
      expectedOutputType: "short_spoken_intro",
      claimControlNotesTr:
        "Application demo slaytlarını (17-29) bir SKU'ya atfetme; Case Management System/Illuminated Darkroom işlevini açıklama; battery runtime'ı garanti gibi sunma.",
      forbiddenClaims: superspectralComparisonBlockedClaims.map(
        (claim) => claim.id,
      ),
    },
    firstTryInstructionTr:
      "Force ve Core'un sensör ve filtre sayısını kısa söyle; iki SKU'yu ayrı tut.",
    secondTryInstructionTr:
      "İkinci denemede ışık sistemi adlarını (Macro Micro Lens / Power Lens) ve optional lens sınırını ekle.",
    reviewTaskTr:
      "Bir sensör karşılaştırması ile bir filtre-sayısı karşılaştırmasını ayrı cümlelerde yaz.",
    journalPromptTr:
      "Hangi cümlede Force ve Core'u ayrı tuttun ve hangi bilgiyi (application demo, Case Management System gibi) bilinçli olarak dışarıda bıraktın?",
    adminCoachingSignalTr:
      "Kullanıcı Force/Core farkını doğru sayılarla anlatıyor ve isteğe bağlı lensi Core'a atfetmiyor mu?",
    sourceReferences: [
      superspectralIdentityReference,
      superspectralSensorReference,
      superspectralSpectralRangeReference,
      superspectralFilterReference,
      superspectralLightSystemReference,
    ],
    claimControlNotesTr:
      "Bu modül yalnız kaynakta basılı Force/Core spec karşılaştırmasını kullanır. Application demo slaytları (17-29), Case Management System, Illuminated Darkroom işlevi, Core'un optional lens uyumluluğu, battery runtime koşulları ve SuperSpectral SAFE içeriği (30-40) bu modülde learner-facing değildir.",
  },
];
