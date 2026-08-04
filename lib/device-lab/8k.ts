import {
  directAfisIntegrationBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unnamedAccreditationBlockedClaim,
  unsupportedSafetyInstructionsBlockedClaim,
  worldFirstBlockedClaim,
} from "./shared-claim-control";
import type {
  DeviceLabClaim,
  DeviceLabModule,
  ProductScope,
  SourceReference,
} from "./types";

const eightKScope: ProductScope = {
  kind: "device",
  deviceSlug: "8k",
};

const eightKIdentityReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md",
  section: "1. Product Identity",
  slideOrPage: "Slide 11; Slides 17–18 and 21–22",
  note: "Source-supported product names and latent-fingerprint imaging category.",
};

const eightKCoreFactsReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md",
  section: "2. Verified Technical Facts",
  slideOrPage: "Slides 7 and 11",
  note:
    "Camera, spectrum, contactless, and powder/chemical-free statements from the manufacturer presentation.",
};

const eightKSoftwareReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md",
  section: "4. Software and Workflow",
  slideOrPage: "Slide 20",
  note: "Source-listed archive, reporting, capture, and export vocabulary.",
};

const eightKUvcReference: SourceReference = {
  sourceFile: "docs/sources/forenscope/8K_PRESENTATION_EXTRACTION.md",
  section: "3. Hardware and Imaging System — Safety statements",
  slideOrPage: "Slide 19",
  note:
    "The slide states that UVC can be harmful to the human body and instructs use with the supplied darkroom.",
};

const eightKSafetyLimitReference: SourceReference = {
  sourceFile: "docs/DEVICE_ENGLISH_SOURCEBOOK.md",
  section: "5. UVC Safety Language",
  slideOrPage: "Sourcebook safety limitation",
  note:
    "The presentation warning is narrow and is not a complete safety/compliance procedure.",
};

export const eightKIdentityClaim: DeviceLabClaim = {
  id: "8k-identity",
  text:
    "The source names the product 8K Latent Fingerprint Detection Tablet and also describes it as an 8K mobile compact system.",
  productScope: eightKScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [eightKIdentityReference],
  attributionRequired: false,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const eightKCameraClaim: DeviceLabClaim = {
  id: "8k-camera-45-9mp",
  text: "The source lists a 45.9MP ‘8K’ imaging camera.",
  productScope: eightKScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "safe",
  releaseStatus: "learner_ready",
  sourceReferences: [eightKCoreFactsReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Technical datasheet with sensor model and exact output dimensions",
  ],
};

export const eightKSpectrumClaim: DeviceLabClaim = {
  id: "8k-spectrum-uv-vis-ir",
  text:
    "The manufacturer presentation lists UVA, UVB, UVC, visible, and infrared imaging capability.",
  productScope: eightKScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [eightKCoreFactsReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "descriptive_light_content",
  missingEvidenceNeeded: [
    "Validation data for performance by surface and operating condition",
  ],
};

export const eightKContactlessClaim: DeviceLabClaim = {
  id: "8k-contactless-workflow",
  text:
    "The manufacturer presentation describes the 8K workflow as contactless and says it does not require contact with the evidence.",
  productScope: eightKScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [eightKCoreFactsReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Independent evidence-handling validation for any preservation guarantee",
  ],
};

export const eightKPowderChemicalClaim: DeviceLabClaim = {
  id: "8k-powder-chemical-free-workflow",
  text:
    "The source states that the described latent-evidence workflow does not require powder or chemicals.",
  productScope: eightKScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "learner_ready",
  sourceReferences: [eightKCoreFactsReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
};

export const eightKSoftwareFeaturesClaim: DeviceLabClaim = {
  id: "8k-source-listed-software-features",
  text:
    "The source lists an image archive, reporting features, and WSQ, TIFF, JPEG, PNG, and BMP export formats.",
  productScope: eightKScope,
  evidenceLevel: "source_stated_capability",
  claimControlLevel: "cautious",
  releaseStatus: "draft_controlled",
  sourceReferences: [eightKSoftwareReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "not_safety_instruction",
  missingEvidenceNeeded: [
    "Software manual with reporting and export workflow details",
  ],
};

export const eightKUvcWarningClaim: DeviceLabClaim = {
  id: "8k-claim-uvc-source-warning",
  text:
    "According to the source, UVC can be harmful to the human body and should be used with the supplied darkroom.",
  productScope: eightKScope,
  evidenceLevel: "verified_technical_fact",
  claimControlLevel: "cautious",
  releaseStatus: "draft_controlled",
  sourceReferences: [eightKUvcReference],
  attributionRequired: true,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "source_warning_only",
  missingEvidenceNeeded: ["Complete UVC safety/compliance document"],
};

export const eightKSafetyCoverageLimitClaim: DeviceLabClaim = {
  id: "8k-uvc-safety-coverage-limit",
  text:
    "The available source warning is not a complete safety course or operator procedure.",
  productScope: eightKScope,
  evidenceLevel: "unclear_needs_verification",
  claimControlLevel: "cautious",
  releaseStatus: "draft_controlled",
  sourceReferences: [eightKSafetyLimitReference],
  attributionRequired: false,
  learnerFacingTextAllowed: true,
  demonstrationOnly: false,
  safetyRelevance: "source_warning_only",
  missingEvidenceNeeded: [
    "Operator manual",
    "Complete UVC safety/compliance document",
  ],
};

const eightKIntroBlockedClaims = [
  worldFirstBlockedClaim,
  performanceGuaranteesBlockedClaim,
  unnamedAccreditationBlockedClaim,
  directAfisIntegrationBlockedClaim,
] as const;

const eightKSafetyBlockedClaims = [
  unsupportedSafetyInstructionsBlockedClaim,
  performanceGuaranteesBlockedClaim,
] as const;

export const eightKModules: readonly DeviceLabModule[] = [
  {
    id: "8k-intro",
    deviceSlug: "8k",
    kind: "intro",
    titleTr: "8K'yi Basit İngilizceyle Tanıtma",
    titleEn: "8K Intro",
    learnerLevel: "A2_B1",
    releaseStatus: "learner_ready",
    moduleGoalTr:
      "8K'nin kaynak destekli kimliğini, kamera ve görüntüleme dilini kısa ve kontrollü İngilizceyle açıklamak.",
    sourceBackedClaims: [
      eightKIdentityClaim,
      eightKCameraClaim,
      eightKSpectrumClaim,
      eightKContactlessClaim,
      eightKPowderChemicalClaim,
    ],
    blockedClaims: eightKIntroBlockedClaims,
    vocabulary: [
      {
        id: "8k-vocab-latent-fingerprint",
        termEn: "latent fingerprint",
        termTr: "gizli parmak izi",
        simpleDefinitionEn:
          "A fingerprint that is not immediately visible or is difficult to see.",
        simpleDefinitionTr:
          "Hemen görünmeyen veya görülmesi zor olan parmak izi.",
        claimControlLevel: "safe",
        sourceReferences: [eightKIdentityReference],
        usageNoteTr: "Detection sonucu veya başarı garantisi eklemeden kullan.",
      },
      {
        id: "8k-vocab-contactless-workflow",
        termEn: "contactless workflow",
        termTr: "temassız iş akışı",
        simpleDefinitionEn:
          "A workflow the manufacturer describes as not requiring contact with the evidence.",
        simpleDefinitionTr:
          "Üreticinin kanıtla temas gerektirmediğini belirttiği iş akışı.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKCoreFactsReference],
        usageNoteTr:
          "Kaynağa/üreticiye atfet; kanıtın hiçbir koşulda etkilenmeyeceğini söyleme.",
      },
      {
        id: "8k-vocab-uv-vis-ir",
        termEn: "UV / VIS / IR imaging",
        termTr: "UV / görünür / IR görüntüleme",
        simpleDefinitionEn:
          "Imaging vocabulary for ultraviolet, visible, and infrared ranges listed in the source.",
        simpleDefinitionTr:
          "Kaynakta listelenen morötesi, görünür ve kızılötesi aralıkların görüntüleme dili.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKCoreFactsReference],
        usageNoteTr:
          "Her yüzeyde eşit performans veya güvenli işletim talimatı çıkarma.",
      },
    ],
    listeningTextEn:
      "This is the 8K Latent Fingerprint Detection Tablet. The source lists a 45.9-megapixel ‘8K’ imaging camera and UV, visible, and infrared imaging capability. The manufacturer presentation describes the workflow as contactless and says it does not require powder or chemicals.",
    listeningTaskTr:
      "Metni dinle ve üç bilgiyi ayır: cihazın adı, kaynakta listelenen kamera ve üreticiye atfedilen workflow açıklaması.",
    speakingPrompt: {
      id: "8k-intro-speaking",
      promptTr:
        "8K'yi 3–4 kısa İngilizce cümleyle tanıt. Contactless ve powder/chemical-free ifadelerinde kaynak atfını koru.",
      promptEn:
        "Introduce the 8K in three or four short sentences and keep manufacturer attribution for workflow claims.",
      expectedOutputType: "short_spoken_intro",
      claimControlNotesTr:
        "Kamera ve spectrum bilgisini genişletme; performans, mesafe, sertifika veya AFIS iddiası ekleme.",
      forbiddenClaims: eightKIntroBlockedClaims.map((claim) => claim.id),
    },
    firstTryInstructionTr:
      "Notlara bakmadan kısa bir tanıtım yap; iddiayı büyütmeden ana fikri tamamla.",
    secondTryInstructionTr:
      "İkinci denemede source states veya manufacturer presentation describes kalıbıyla atfı daha görünür yap.",
    reviewTaskTr:
      "45.9MP kamera, UV/VIS/IR ve contactless workflow alanlarından ikisini kontrollü bir cümlede tekrar et.",
    journalPromptTr:
      "Hangi cümlede kaynak atfı kullandın ve hangi iddiayı bilinçli olarak söylemedin?",
    adminCoachingSignalTr:
      "Kullanıcı ürün superlative'i eklemeden kimlik, kamera ve atıflı workflow bilgisini ayırabiliyor mu?",
    sourceReferences: [eightKIdentityReference, eightKCoreFactsReference],
    claimControlNotesTr:
      "Intro yalnız kaynak destekli kimlik ve capability vocabulary kullanır. ‘8K’ ifadesinden exact pixel dimensions veya video standardı çıkarılmaz.",
  },
  {
    id: "8k-customer-demo",
    deviceSlug: "8k",
    kind: "customer_demo",
    titleTr: "8K Kontrollü Müşteri Açıklaması",
    titleEn: "8K Customer Demo",
    learnerLevel: "B1",
    releaseStatus: "draft_controlled",
    moduleGoalTr:
      "8K'yi kısa, kaynak atıflı ve broşür diline kaçmadan müşteriye açıklamak.",
    sourceBackedClaims: [
      eightKIdentityClaim,
      eightKCameraClaim,
      eightKSpectrumClaim,
      eightKContactlessClaim,
      eightKPowderChemicalClaim,
      eightKSoftwareFeaturesClaim,
    ],
    blockedClaims: eightKIntroBlockedClaims,
    vocabulary: [
      {
        id: "8k-demo-vocab-imaging-camera",
        termEn: "imaging camera",
        termTr: "görüntüleme kamerası",
        simpleDefinitionEn: "The camera used to capture the forensic image.",
        simpleDefinitionTr: "Adli görüntüyü almak için kullanılan kamera.",
        claimControlLevel: "safe",
        sourceReferences: [eightKCoreFactsReference],
        usageNoteTr:
          "45.9MP değerini kaynakta listelenen spec olarak söyle; görüntü kalitesi garantisi ekleme.",
      },
      {
        id: "8k-demo-vocab-image-archive",
        termEn: "image archive",
        termTr: "görüntü arşivi",
        simpleDefinitionEn:
          "An archive feature listed in the source software description.",
        simpleDefinitionTr:
          "Kaynağın yazılım açıklamasında listelenen arşiv özelliği.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKSoftwareReference],
        usageNoteTr:
          "Tam workflow, otomatik kayıt veya entegrasyon davranışı uydurma.",
      },
      {
        id: "8k-demo-vocab-export-format",
        termEn: "export format",
        termTr: "dışa aktarma formatı",
        simpleDefinitionEn:
          "A file format listed by the source for exporting a captured image.",
        simpleDefinitionTr:
          "Kaynakta çekilen görüntüyü dışa aktarmak için listelenen dosya formatı.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKSoftwareReference],
        usageNoteTr:
          "Belirli bir dış sistemle uyumluluk veya gerekli format iddiası kurma.",
      },
    ],
    listeningTextEn:
      "The 8K is a latent-fingerprint imaging system. The source lists a 45.9-megapixel camera and UV, visible, and infrared imaging capability. The manufacturer presentation describes a contactless workflow that does not require powder or chemicals. It also lists image-archive, reporting, and export features.",
    listeningTaskTr:
      "Açıklamadaki safe spec ile manufacturer-attributed capability cümlelerini birbirinden ayır.",
    speakingPrompt: {
      id: "8k-customer-demo-speaking",
      promptTr:
        "Yaklaşık 30–45 saniyelik kontrollü bir müşteri açıklaması yap. Kamera ve görüntüleme dilini açıkla; workflow claim'lerinde kaynak atfı kullan.",
      promptEn:
        "Give a controlled 30–45 second customer explanation with source attribution for workflow claims.",
      expectedOutputType: "controlled_customer_demo",
      claimControlNotesTr:
        "Sunum feature'larını performans, interoperability veya complete operating workflow gibi sunma.",
      forbiddenClaims: eightKIntroBlockedClaims.map((claim) => claim.id),
    },
    firstTryInstructionTr:
      "Kısa konuş; ürün adı, kamera ve bir atıflı workflow cümlesi yeterlidir.",
    secondTryInstructionTr:
      "İkinci denemede broşür sıfatlarını çıkar ve bir source limitation cümlesi ekle.",
    reviewTaskTr:
      "Bir verified spec ile bir source-stated capability örneğini ayırarak yaz.",
    journalPromptTr:
      "Açıklamanın hangi bölümü fact, hangi bölümü manufacturer-stated capability idi?",
    adminCoachingSignalTr:
      "Kullanıcı source attribution'ı koruyor ve export/archive vocabulary'yi direct integration'a dönüştürmüyor mu?",
    sourceReferences: [
      eightKIdentityReference,
      eightKCoreFactsReference,
      eightKSoftwareReference,
    ],
    claimControlNotesTr:
      "Bu modül kısa communication practice'tir; operator procedure, performans kanıtı veya sistem entegrasyonu değildir.",
  },
  {
    id: "8k-uvc-source-warning",
    deviceSlug: "8k",
    kind: "safety",
    titleTr: "8K UVC Kaynak Uyarısı",
    titleEn: "8K UVC Source Warning",
    learnerLevel: "A2_B1",
    releaseStatus: "draft_controlled",
    moduleGoalTr:
      "Mevcut sunumdaki iki parçalı UVC uyarısını doğru İngilizceyle söylemek ve bunun tam güvenlik eğitimi olmadığını belirtmek.",
    sourceBackedClaims: [eightKUvcWarningClaim, eightKSafetyCoverageLimitClaim],
    blockedClaims: eightKSafetyBlockedClaims,
    vocabulary: [
      {
        id: "8k-uvc-vocab-harmful",
        termEn: "harmful",
        termTr: "zararlı",
        simpleDefinitionEn: "Able to cause harm.",
        simpleDefinitionTr: "Zarara yol açabilen.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKUvcReference],
        usageNoteTr:
          "Kaynak atfını koru; exposure sonucu veya tıbbi etki ayrıntısı ekleme.",
      },
      {
        id: "8k-uvc-vocab-supplied-darkroom",
        termEn: "supplied darkroom",
        termTr: "ürünle birlikte verilen karanlık oda",
        simpleDefinitionEn:
          "The darkroom supplied with the product, as described in the source warning.",
        simpleDefinitionTr:
          "Kaynak uyarısında ürünle birlikte verildiği belirtilen karanlık oda.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKUvcReference],
        usageNoteTr:
          "Generic darkroom yerine supplied darkroom anlamını koru.",
      },
      {
        id: "8k-uvc-vocab-source-warning",
        termEn: "source warning",
        termTr: "kaynak uyarısı",
        simpleDefinitionEn:
          "A warning stated in the available manufacturer presentation.",
        simpleDefinitionTr:
          "Mevcut üretici sunumunda belirtilen uyarı.",
        claimControlLevel: "cautious",
        sourceReferences: [eightKUvcReference],
        usageNoteTr:
          "Bu uyarıyı complete safety course veya certification olarak sunma.",
      },
    ],
    listeningTextEn:
      "According to the source, UVC can be harmful to the human body. Use UVC with the supplied darkroom. This source warning is not a complete safety course or operator procedure.",
    listeningTaskTr:
      "İki zorunlu bölümü yakala: harmful-to-the-human-body uyarısı ve supplied-darkroom talimatı. Son cümlenin kapsam sınırı olduğunu belirt.",
    speakingPrompt: {
      id: "8k-uvc-warning-speaking",
      promptTr:
        "İki parçalı UVC source warning'i 2–3 İngilizce cümleyle söyle ve bunun tam safety training olmadığını ekle.",
      promptEn:
        "Restate the two-part UVC source warning and add its safety-coverage limitation.",
      expectedOutputType: "source_warning_restatement",
      claimControlNotesTr:
        "PPE, exposure limit, eye/skin rule, emergency step veya safe-distance talimatı ekleme.",
      forbiddenClaims: eightKSafetyBlockedClaims.map((claim) => claim.id),
    },
    firstTryInstructionTr:
      "Önce harmful ve supplied darkroom anlamlarını eksiksiz söyle.",
    secondTryInstructionTr:
      "İkinci denemede according to the source ve not a complete safety course sınırlarını daha net yap.",
    reviewTaskTr:
      "Eksik cümleyi tamamla: According to the source, UVC can be harmful to the human body. Use UVC with the supplied darkroom.",
    journalPromptTr:
      "Uyarıda hangi iki bilgiyi birlikte söylemen gerekiyor ve kaynak hangi ayrıntıları vermiyor?",
    adminCoachingSignalTr:
      "Kullanıcı exact source warning'i eksiksiz söylüyor ve ek güvenlik prosedürü uydurmuyor mu?",
    sourceReferences: [eightKUvcReference, eightKSafetyLimitReference],
    claimControlNotesTr:
      "Safety state source_warning_only'dir. Bu modül complete UVC safety/compliance training değildir ve operator manual'ın yerini almaz.",
  },
];
