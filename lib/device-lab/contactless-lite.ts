import {
  catalogToDeviceTransferBlockedClaim,
  contactlessLiteBiologicalUsesBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
  worldFirstBlockedClaim,
} from "./shared-claim-control";
import type {
  BlockedClaim,
  DeviceLabClaim,
  DeviceLabModule,
  ProductScope,
  SourceReference,
} from "./types";

const contactlessLiteScope: ProductScope = {
  kind: "device",
  deviceSlug: "contactless-lite",
};

const contactlessLiteIdentityReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md",
  section: "2. Product Identity",
  slideOrPage: "Slides 8 and 11–14",
  note:
    "Product identity and manufacturer-stated non-contact imaging purpose.",
};

const contactlessLiteCameraReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slide 16",
  note: "32.5MP CMOS sensor and RAW-capable imaging statement.",
};

const contactlessLiteRangeReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md",
  section: "3. Verified Technical Facts Table",
  slideOrPage: "Slides 14 and 16",
  note:
    "Manufacturer-stated non-contact imaging range; no independent field-performance validation is shown.",
};

const contactlessLiteLedReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md",
  section: "4. Hardware / Imaging / Optics / Sensors",
  slideOrPage: "Slide 15",
  note: "Four named narrow-band LED groups: White, Blue, Green, and Red.",
};

const contactlessLiteDemoReference: SourceReference = {
  sourceFile:
    "docs/sources/forenscope/CONTACTLESS_LITE_PRESENTATION_EXTRACTION.md",
  section: "6. Application Areas and Demonstrated Scenarios",
  slideOrPage: "Slides 19–35",
  note:
    "Sixteen named device-labeled examples plus one unlabeled visual example; demonstrations are not validation data.",
};

export const contactlessLiteUnsupportedSoftwareBlockedClaim: BlockedClaim = {
  id: "blocked-contactless-lite-unsupported-software",
  text:
    "Contactless LITE software, reporting, AFIS, cloud, archive, or AI features",
  affectedDevices: ["contactless-lite"],
  reason:
    "The device presentation does not document these software or integration areas.",
  evidenceNeededToUnblock: [
    "Device-specific software manual",
    "Export and reporting documentation",
    "Named integration specification",
  ],
};

export const contactlessLiteFourKBlockedClaim: BlockedClaim = {
  id: "blocked-contactless-lite-overview-4k",
  text: "Contactless LITE 4K video capability",
  affectedDevices: ["contactless-lite"],
  reason:
    "The statement appears in the High-Tech overview but not in the device-specific extraction.",
  evidenceNeededToUnblock: [
    "Contactless LITE-specific technical datasheet or manual",
  ],
};

export const contactlessLiteSpectralRangeBlockedClaim: BlockedClaim = {
  id: "blocked-contactless-lite-spectral-range",
  text: "A specific multispectral wavelength range for Contactless LITE",
  affectedDevices: ["contactless-lite"],
  reason:
    "The presentation uses multispectral wording but does not provide wavelength bands.",
  evidenceNeededToUnblock: [
    "Device-specific LED wavelength or spectral-band datasheet",
  ],
};

export const contactlessLiteIdentityClaim: DeviceLabClaim = {
  id: "contactless-lite-identity",
  text:
    "The source names the product Contactless LITE and Contactless LITE Evidence Imaging System.",
  productScope: contactlessLiteScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [contactlessLiteIdentityReference],
  attributionRequired: false,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const contactlessLiteNonContactClaim: DeviceLabClaim = {
  id: "contactless-lite-non-contact-imaging",
  text:
    "The manufacturer presentation describes Contactless LITE as designed for non-contact imaging.",
  productScope: contactlessLiteScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [contactlessLiteIdentityReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Independent evidence-handling validation for any preservation guarantee",
  ],
};

export const contactlessLiteCameraClaim: DeviceLabClaim = {
  id: "contactless-lite-camera-raw",
  text:
    "The source lists a 32.5MP CMOS sensor and 32.5MP RAW imaging support.",
  productScope: contactlessLiteScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [contactlessLiteCameraReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const contactlessLiteLedClaim: DeviceLabClaim = {
  id: "contactless-lite-four-led-groups",
  text:
    "The source lists four LED groups: White, Blue, Green, and Red.",
  productScope: contactlessLiteScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [contactlessLiteLedReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
  missingEvidenceNeeded: ["Device-specific LED wavelength-band datasheet"],
};

export const contactlessLiteRangeClaim: DeviceLabClaim = {
  id: "contactless-lite-source-stated-range",
  text:
    "The manufacturer presentation states a non-contact imaging range from 20 centimeters to 5 meters; it is not a guaranteed field result.",
  productScope: contactlessLiteScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [contactlessLiteRangeReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Test method and field-performance data for the stated range",
  ],
};

export const contactlessLiteSurfaceDemonstrationsClaim: DeviceLabClaim = {
  id: "contactless-lite-named-surface-demonstrations",
  text:
    "The presentation contains sixteen named Contactless LITE hard- or reflective-surface demonstration examples.",
  productScope: contactlessLiteScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [contactlessLiteDemoReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: true,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Independent validation data",
    "Sample size, test conditions, and success-rate evidence",
  ],
};

const contactlessLiteIntroBlockedClaims = [
  worldFirstBlockedClaim,
  contactlessLiteBiologicalUsesBlockedClaim,
  contactlessLiteUnsupportedSoftwareBlockedClaim,
  contactlessLiteFourKBlockedClaim,
  contactlessLiteSpectralRangeBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
  catalogToDeviceTransferBlockedClaim,
] as const;

const contactlessLiteDemoBlockedClaims = [
  worldFirstBlockedClaim,
  contactlessLiteBiologicalUsesBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
] as const;

export const contactlessLiteModules: readonly DeviceLabModule[] = [
  {
    id: "contactless-lite-intro",
    deviceSlug: "contactless-lite",
    kind: "intro",
    titleTr: "Contactless LITE Tanıtımı",
    titleEn: "Contactless LITE Intro",
    learnerLevel: "A2_B1",
    releaseStatus: "learner_ready",
    moduleGoalTr:
      "Contactless LITE kimliğini, kamera, RAW, dört LED grubu ve kaynakta belirtilen mesafe dilini kontrollü biçimde açıklamak.",
    sourceBackedClaims: [
      contactlessLiteIdentityClaim,
      contactlessLiteNonContactClaim,
      contactlessLiteCameraClaim,
      contactlessLiteLedClaim,
      contactlessLiteRangeClaim,
    ],
    blockedClaims: contactlessLiteIntroBlockedClaims,
    vocabulary: [
      {
        id: "contactless-lite-vocab-non-contact-imaging",
        termEn: "non-contact imaging",
        termTr: "temassız görüntüleme",
        simpleDefinitionEn:
          "Imaging that the manufacturer describes as not requiring physical contact with the surface.",
        simpleDefinitionTr:
          "Üreticinin yüzeyle fiziksel temas gerektirmediğini belirttiği görüntüleme.",
        claimControlLevel: "cautious",
        sourceReferences: [contactlessLiteIdentityReference],
        usageNoteTr:
          "Kanıtın hiçbir koşulda zarar görmeyeceği veya kontamine olmayacağı garantisini ekleme.",
      },
      {
        id: "contactless-lite-vocab-cmos-sensor",
        termEn: "32.5MP CMOS sensor",
        termTr: "32.5MP CMOS sensör",
        simpleDefinitionEn:
          "The camera sensor specification listed in the presentation.",
        simpleDefinitionTr: "Sunumda listelenen kamera sensörü özelliği.",
        claimControlLevel: "safe",
        sourceReferences: [contactlessLiteCameraReference],
        usageNoteTr:
          "Image quality, accuracy veya identification sonucu çıkarma.",
      },
      {
        id: "contactless-lite-vocab-raw-imaging",
        termEn: "RAW imaging",
        termTr: "RAW görüntüleme",
        simpleDefinitionEn:
          "A source-listed option for capturing image data in RAW format.",
        simpleDefinitionTr:
          "Görüntü verisini RAW formatında almak için kaynakta listelenen seçenek.",
        claimControlLevel: "safe",
        sourceReferences: [contactlessLiteCameraReference],
        usageNoteTr:
          "Software, archive veya external-system compatibility iddiası ekleme.",
      },
      {
        id: "contactless-lite-vocab-led-groups",
        termEn: "LED groups",
        termTr: "LED grupları",
        simpleDefinitionEn:
          "The White, Blue, Green, and Red light groups listed in the source.",
        simpleDefinitionTr:
          "Kaynakta listelenen White, Blue, Green ve Red ışık grupları.",
        claimControlLevel: "safe",
        sourceReferences: [contactlessLiteLedReference],
        usageNoteTr:
          "Wavelength veya surface-specific selection rule çıkarma.",
      },
    ],
    listeningTextEn:
      "This is Contactless LITE. The manufacturer presentation describes it as a non-contact imaging device. The source lists a 32.5-megapixel CMOS sensor with RAW support and four LED groups: White, Blue, Green, and Red. It also states a range from 20 centimeters to 5 meters, but this is a source-stated range, not a guaranteed field result.",
    listeningTaskTr:
      "Kimlik, camera/RAW spec, LED groups ve caution gerektiren source-stated range cümlesini ayır.",
    speakingPrompt: {
      id: "contactless-lite-intro-speaking",
      promptTr:
        "Contactless LITE'ı 4 kısa İngilizce cümleyle tanıt. Mesafe bilgisini üretici sunumuna atfet ve garanti gibi söyleme.",
      promptEn:
        "Introduce Contactless LITE in four short sentences and attribute the stated range to the manufacturer presentation.",
      expectedOutputType: "short_spoken_intro",
      claimControlNotesTr:
        "Software, reporting, AFIS, cloud, AI, biological evidence, wavelength veya video claim'i ekleme.",
      forbiddenClaims: contactlessLiteIntroBlockedClaims.map(
        (claim) => claim.id,
      ),
    },
    firstTryInstructionTr:
      "Product identity, camera/RAW ve LED groups bilgisini kısa söyle.",
    secondTryInstructionTr:
      "İkinci denemede mesafe cümlesine manufacturer presentation states ve not a guaranteed field result sınırını ekle.",
    reviewTaskTr:
      "Bir safe spec ile bir cautious source-stated capability örneğini ayrı cümlelerde yaz.",
    journalPromptTr:
      "Hangi Contactless LITE claim'inde attribution kullandın ve hangi blocked alanı dışarıda bıraktın?",
    adminCoachingSignalTr:
      "Kullanıcı LITE özelliklerini 8K/LAB ULTRA ile karıştırmadan range caveat'ını koruyor mu?",
    sourceReferences: [
      contactlessLiteIdentityReference,
      contactlessLiteCameraReference,
      contactlessLiteRangeReference,
      contactlessLiteLedReference,
    ],
    claimControlNotesTr:
      "Contactless LITE ayrı üründür. 4K, wavelength bands, software/reporting, AFIS ve category-level application claims bu modülde learner-facing değildir.",
  },
  {
    id: "contactless-lite-reflective-surfaces-demo",
    deviceSlug: "contactless-lite",
    kind: "customer_demo",
    titleTr: "Contactless LITE Yansıtıcı Yüzey Demo Dili",
    titleEn: "Contactless LITE Reflective Surfaces Demo",
    learnerLevel: "B1",
    releaseStatus: "learner_ready",
    moduleGoalTr:
      "Device-labeled presentation demonstrations'ı performans validation sonucu gibi sunmadan özetlemek.",
    sourceBackedClaims: [contactlessLiteSurfaceDemonstrationsClaim],
    blockedClaims: contactlessLiteDemoBlockedClaims,
    vocabulary: [
      {
        id: "contactless-lite-demo-vocab-reflective-surface",
        termEn: "reflective surface",
        termTr: "yansıtıcı yüzey",
        simpleDefinitionEn: "A surface that reflects light.",
        simpleDefinitionTr: "Işığı yansıtan yüzey.",
        claimControlLevel: "safe",
        sourceReferences: [contactlessLiteDemoReference],
        usageNoteTr:
          "Her reflective surface'te başarı veya doğru setting garantisi verme.",
      },
      {
        id: "contactless-lite-demo-vocab-presentation-demonstration",
        termEn: "presentation demonstration",
        termTr: "sunum gösterimi",
        simpleDefinitionEn:
          "An example shown in the manufacturer presentation rather than an independent validation study.",
        simpleDefinitionTr:
          "Bağımsız validation çalışması yerine üretici sunumunda gösterilen örnek.",
        claimControlLevel: "cautious",
        sourceReferences: [contactlessLiteDemoReference],
        usageNoteTr:
          "Demonstration ile validated result arasındaki farkı görünür tut.",
      },
      {
        id: "contactless-lite-demo-vocab-device-labeled-example",
        termEn: "device-labeled example",
        termTr: "cihaz etiketi taşıyan örnek",
        simpleDefinitionEn:
          "An example slide that explicitly carries the Contactless LITE label.",
        simpleDefinitionTr:
          "Contactless LITE etiketini açıkça taşıyan örnek slayt.",
        claimControlLevel: "cautious",
        sourceReferences: [contactlessLiteDemoReference],
        usageNoteTr:
          "Unlabeled veya category-level örnekleri otomatik olarak cihaza atfetme.",
      },
    ],
    listeningTextEn:
      "The Contactless LITE presentation contains sixteen named hard- or reflective-surface examples. The device-labeled slides include two window-glass examples, a hard disk, a security alarm, a knife, a mirror, a shower tap, an electric switch, table glass, tape, plastic, a beverage coaster, marble, a CD, a whiteboard, and a perfume bottle. These are presentation demonstrations, not independent performance validation.",
    listeningTaskTr:
      "Surface örneklerini dinle ve demonstration ile independent validation arasındaki caveat cümlesini yakala.",
    speakingPrompt: {
      id: "contactless-lite-demo-speaking",
      promptTr:
        "Sunumdan 3–4 device-labeled surface seçerek kısa demo özeti yap. Bunların presentation demonstrations olduğunu açıkça söyle.",
      promptEn:
        "Summarize three or four device-labeled surface examples and identify them as presentation demonstrations.",
      expectedOutputType: "demonstration_summary",
      claimControlNotesTr:
        "Success rate, universal surface compatibility, validated performance veya biological-evidence claim'i ekleme.",
      forbiddenClaims: contactlessLiteDemoBlockedClaims.map(
        (claim) => claim.id,
      ),
    },
    firstTryInstructionTr:
      "Üç named surface seç ve presentation demonstrates kalıbını kullan.",
    secondTryInstructionTr:
      "İkinci denemede not independent validation caveat'ını açıkça ekle.",
    reviewTaskTr:
      "Bir surface example cümlesini success claim olmadan yaz ve demonstration caveat'ını ekle.",
    journalPromptTr:
      "Bir demonstration örneğini validation sonucu gibi göstermemek için hangi kalıbı kullandın?",
    adminCoachingSignalTr:
      "Kullanıcı device-labeled surfaces ile category-level body-fluid/blood/GSR/Touch-DNA iddialarını ayırabiliyor mu?",
    sourceReferences: [contactlessLiteDemoReference],
    claimControlNotesTr:
      "Phone-case surface'i bu ilk modüle alınmamıştır; slide 24 unlabeled olduğu için ancak visual-inference caveat'ıyla kullanılabilir. On altı named example, validated performance veya success rate değildir.",
  },
];
