import {
  catalogToDeviceTransferBlockedClaim,
  directAfisIntegrationBlockedClaim,
  marketingSuperlativesBlockedClaim,
  performanceGuaranteesBlockedClaim,
  tzoomDnaAnalysisBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
} from "./shared-claim-control";
import type {
  BlockedClaim,
  DeviceLabClaim,
  DeviceLabModule,
  ProductScope,
  SourceReference,
} from "./types";

const tzoomScope: ProductScope = {
  kind: "device",
  deviceSlug: "tzoom-plus-dna",
};

const tzoomIdentityReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md",
  section: "2. Product Identity",
  slideOrPage: "Slide 10",
  note:
    "Source-supported product name and category; the presentation shows trace visualization examples only, without genetic sampling or laboratory testing.",
};

const tzoomComponentsReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slide 11",
  note: "Seven listed components from the device presentation.",
};

const tzoomLightSystemsReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md",
  section: "4. Hardware / Imaging / Optics / Sensors",
  slideOrPage: "Slides 13–14",
  note:
    "Power Macro Ring Light System (8 channels) and Macro-Micro Ring Light System (15 channels), kept as two separate systems.",
};

const tzoomFilterReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slide 15",
  note: "Seven named filters with printed wavelength labels.",
};

const tzoomSoftwareReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md",
  section: "5. Software and Workflow",
  slideOrPage: "Slide 16",
  note:
    "Source-listed Android software, archive, reporting, export, connectivity, and stamping features. AUTO Search, Smart Button, and the 6-meter-to-600-micron zoom figure are excluded as unclear/needs verification.",
};

export const tzoomBareSlideAttributionBlockedClaim: BlockedClaim = {
  id: "blocked-tzoom-bare-slide-attribution",
  text:
    "Gunshot-residue application slides 17 and 22, which are labeled only \"t-ZOOM\" without confirmed t-ZOOM Plus DNA attribution",
  affectedDevices: ["tzoom-plus-dna"],
  reason:
    "Slides 17 and 22 drop \"Plus DNA\" while every other device slide keeps it; attribution to t-ZOOM Plus DNA is unresolved.",
  evidenceNeededToUnblock: [
    "Product/version clarification from an authoritative ForenScope source",
  ],
};

export const tzoomUnclearFunctionsBlockedClaim: BlockedClaim = {
  id: "blocked-tzoom-unclear-functions",
  text:
    "The \"6 meters to 600 microns\" zoom figure, and the AUTO Search Function and Smart Button Function behavior",
  affectedDevices: ["tzoom-plus-dna"],
  reason:
    "The zoom range is unusually wide and unverified against a datasheet; AUTO Search and Smart Button are named only, with no defined behavior in the source.",
  evidenceNeededToUnblock: [
    "Technical datasheet confirming the zoom range",
    "Software/operator manual defining AUTO Search and Smart Button",
  ],
};

export const tzoomContactlessCompanyLevelBlockedClaim: BlockedClaim = {
  id: "blocked-tzoom-contactless-company-level",
  text:
    "Contactless or no-powder/no-chemical claims attributed specifically to t-ZOOM Plus DNA",
  affectedDevices: ["tzoom-plus-dna"],
  reason:
    "The source states this at the ForenScope company level (slide 7), not on a t-ZOOM Plus DNA-labeled slide.",
  evidenceNeededToUnblock: [
    "A t-ZOOM Plus DNA-labeled source confirming contactless operation",
  ],
};

export const tzoomApplicationDemoBlockedClaim: BlockedClaim = {
  id: "blocked-tzoom-application-demo",
  text:
    "Application demonstration content (GSR, semen, blood, dead skin, epithelial cell, and sweat visualization examples)",
  affectedDevices: ["tzoom-plus-dna"],
  reason:
    "Deferred from this release: each example is a single illustrative slide with no stated methodology, sample size, or independent validation, and two of the eight examples carry the unresolved bare-\"t-ZOOM\" attribution.",
  evidenceNeededToUnblock: [
    "Device-specific validation or sample-size data per application",
    "Resolved attribution for the bare-\"t-ZOOM\" slides",
  ],
};

export const tzoomIdentityClaim: DeviceLabClaim = {
  id: "tzoom-identity",
  text:
    "The source names the product t-ZOOM Plus DNA and describes it as a multispectral forensic imaging system for evidence trace visualization.",
  productScope: tzoomScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [tzoomIdentityReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const tzoomComponentsClaim: DeviceLabClaim = {
  id: "tzoom-seven-components",
  text:
    "The source lists seven components: the t-ZOOM handheld terminal, changeable Macro-Micro and Power Macro lenses, an Illuminated Darkroom, a Darkroom, the ForenScope Case Management System, a changeable battery, and an HDMI cable.",
  productScope: tzoomScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [tzoomComponentsReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Functional description of the Illuminated Darkroom, Darkroom, and Case Management System",
  ],
};

export const tzoomLightSystemsClaim: DeviceLabClaim = {
  id: "tzoom-two-ring-light-systems",
  text:
    "The source lists two separate ring-light systems: an eight-channel Power Macro Ring Light System and a fifteen-channel Macro-Micro Ring Light System.",
  productScope: tzoomScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [tzoomLightSystemsReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
};

export const tzoomFilterListClaim: DeviceLabClaim = {
  id: "tzoom-seven-named-filters",
  text:
    "The source lists a seven-position filter system: Full Spectrum, Narrow Band Pass 415nm, Long Pass 495nm, Narrow Band Pass 532nm, Long Pass 570nm, Long Pass 590nm, and IR-Pass.",
  productScope: tzoomScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [tzoomFilterReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
};

export const tzoomSoftwareConnectivityClaim: DeviceLabClaim = {
  id: "tzoom-source-listed-software-connectivity",
  text:
    "The source lists Android control software with an image archive platform, a detailed reporting feature, USB and email export, TF-card/4G/WiFi/Bluetooth connectivity, and embedded light, filter, date, time, and location stamps.",
  productScope: tzoomScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [tzoomSoftwareReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Software/export/reporting manual",
  ],
};

const tzoomIntroBlockedClaims = [
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
] as const;

export const tzoomPlusDnaModules: readonly DeviceLabModule[] = [
  {
    id: "tzoom-plus-dna-intro",
    deviceSlug: "tzoom-plus-dna",
    kind: "intro",
    titleTr: "t-ZOOM Plus DNA'yı Basit İngilizceyle Tanıtma",
    titleEn: "t-ZOOM Plus DNA Intro",
    learnerLevel: "A2_B1",
    releaseStatus: "learner_ready",
    moduleGoalTr:
      "t-ZOOM Plus DNA'nın kaynak destekli kimliğini, bileşenlerini, ışık/filtre sistemlerini ve yazılım/bağlantı sözcük dağarcığını kısa ve kontrollü İngilizceyle açıklamak.",
    sourceBackedClaims: [
      tzoomIdentityClaim,
      tzoomComponentsClaim,
      tzoomLightSystemsClaim,
      tzoomFilterListClaim,
      tzoomSoftwareConnectivityClaim,
    ],
    blockedClaims: tzoomIntroBlockedClaims,
    vocabulary: [
      {
        id: "tzoom-vocab-multispectral-imaging",
        termEn: "multispectral imaging",
        termTr: "çok bantlı (multispektral) görüntüleme",
        simpleDefinitionEn:
          "Imaging across more than one light range, as the source describes for this device.",
        simpleDefinitionTr:
          "Kaynağın bu cihaz için açıkladığı, birden fazla ışık aralığında görüntüleme.",
        claimControlLevel: "cautious",
        sourceReferences: [tzoomIdentityReference],
        usageNoteTr:
          "DNA çıkarma veya laboratuvar analizi anlamı ekleme; yalnız görüntüleme/visualization anlamında kullan.",
      },
      {
        id: "tzoom-vocab-changeable-lens",
        termEn: "changeable lens",
        termTr: "değiştirilebilir lens",
        simpleDefinitionEn:
          "A Macro-Micro or Power Macro lens listed as a component of the device.",
        simpleDefinitionTr:
          "Cihazın bileşeni olarak listelenen Macro-Micro veya Power Macro lens.",
        claimControlLevel: "safe",
        sourceReferences: [tzoomComponentsReference],
        usageNoteTr: "Lens performansı veya çözünürlük garantisi ekleme.",
      },
      {
        id: "tzoom-vocab-ring-light-system",
        termEn: "ring-light system",
        termTr: "halka ışık sistemi",
        simpleDefinitionEn:
          "One of the two source-listed light systems used with the device.",
        simpleDefinitionTr:
          "Cihazla birlikte kaynakta listelenen iki ışık sisteminden biri.",
        claimControlLevel: "safe",
        sourceReferences: [tzoomLightSystemsReference],
        usageNoteTr:
          "Power Macro ve Macro-Micro sistemlerini birleştirme; ayrı say.",
      },
      {
        id: "tzoom-vocab-motorized-filter",
        termEn: "motorized filter",
        termTr: "motorlu filtre",
        simpleDefinitionEn:
          "One of the seven named filters in the source-listed filter system.",
        simpleDefinitionTr:
          "Kaynakta listelenen yedi filtreden biri.",
        claimControlLevel: "safe",
        sourceReferences: [tzoomFilterReference],
        usageNoteTr:
          "Belirli bir yüzey için doğru filtre garantisi verme.",
      },
      {
        id: "tzoom-vocab-image-archive-platform",
        termEn: "image archive platform",
        termTr: "görüntü arşiv platformu",
        simpleDefinitionEn:
          "The archive feature listed in the source software description.",
        simpleDefinitionTr:
          "Kaynağın yazılım açıklamasında listelenen arşiv özelliği.",
        claimControlLevel: "cautious",
        sourceReferences: [tzoomSoftwareReference],
        usageNoteTr:
          "Tam workflow veya otomatik senkronizasyon iddiası uydurma.",
      },
    ],
    listeningTextEn:
      "This is the t-ZOOM Plus DNA. The source describes it as a multispectral forensic imaging system for evidence trace visualization. It lists seven components, including changeable Macro-Micro and Power Macro lenses, an Illuminated Darkroom, and a Darkroom. The source also lists two ring-light systems and a seven-position filter system, plus Android software with an image archive, reporting, export, and connectivity features.",
    listeningTaskTr:
      "Metni dinle ve dört bilgiyi ayır: kimlik, yedi bileşen listesi, iki ışık/filtre sistemi ve yazılım/bağlantı vocabulary.",
    speakingPrompt: {
      id: "tzoom-intro-speaking",
      promptTr:
        "t-ZOOM Plus DNA'yı 3–4 kısa İngilizce cümleyle tanıt. Bileşen ve ışık/filtre bilgisini kaynağa atfet; DNA laboratuvar testi anlamına gelecek bir ifade ekleme.",
      promptEn:
        "Introduce the t-ZOOM Plus DNA in three or four short sentences and keep source attribution for the component and light/filter lists.",
      expectedOutputType: "short_spoken_intro",
      claimControlNotesTr:
        "Bare-t-ZOOM slaytlarını (17, 22), 6m-600 mikron zoom değerini, AUTO Search/Smart Button işlevlerini, contactless şirket-düzeyi ifadesini ve uygulama demo örneklerini bu modülde kullanma.",
      forbiddenClaims: tzoomIntroBlockedClaims.map((claim) => claim.id),
    },
    firstTryInstructionTr:
      "Notlara bakmadan kısa bir tanıtım yap; kimlik ve bileşen listesinden ikisini tamamla.",
    secondTryInstructionTr:
      "İkinci denemede source lists veya the source describes kalıbıyla atfı daha görünür yap.",
    reviewTaskTr:
      "Yedi bileşen, iki ışık sistemi ve yedi filtreden birer örneği kontrollü bir cümlede tekrar et.",
    journalPromptTr:
      "Hangi cümlede kaynak atfı kullandın ve hangi bilgiyi (zoom değeri, AUTO Search gibi) bilinçli olarak dışarıda bıraktın?",
    adminCoachingSignalTr:
      "Kullanıcı bileşen ve ışık/filtre bilgisini DNA laboratuvar testi iması eklemeden ayırabiliyor mu?",
    sourceReferences: [
      tzoomIdentityReference,
      tzoomComponentsReference,
      tzoomLightSystemsReference,
      tzoomFilterReference,
      tzoomSoftwareReference,
    ],
    claimControlNotesTr:
      "Bu modül yalnız kaynak destekli kimlik, bileşen, ışık/filtre ve yazılım vocabulary kullanır. 'Ultimate DNA LAB system' gibi pazarlama ifadeleri, DNA çıkarma/analiz iddiası, bare-t-ZOOM slaytları (17, 22), zoom aralığı, AUTO Search/Smart Button ve uygulama demo örnekleri bu ilk sürümde learner-facing değildir.",
  },
];
