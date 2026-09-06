import assert from "node:assert/strict";
import { readdir, readFile, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  ACTIVE_DAY_STORAGE_KEY,
  CLOUD_SYNC_LAST_SYNC_STORAGE_KEY,
  DEVICE_LAB_PRACTICE_STORAGE_KEY,
  PRACTICE_PROGRESS_STORAGE_KEY,
  exportLocalBackupAsJson,
  importLocalBackupFromJson,
} from "../lib/local-storage-keys.ts";
import {
  getVoiceRecordingErrorMessage,
  selectVoiceRecorderMimeType,
  VOICE_RECORDER_PERMISSION_TIMEOUT_MS,
  VOICE_RECORDING_MAX_SECONDS,
} from "../lib/voice-recording.ts";

class MemoryStorage {
  #values = new Map();
  get length() {
    return this.#values.size;
  }
  clear() {
    this.#values.clear();
  }
  getItem(key) {
    return this.#values.get(String(key)) ?? null;
  }
  key(index) {
    return Array.from(this.#values.keys())[index] ?? null;
  }
  removeItem(key) {
    this.#values.delete(String(key));
  }
  setItem(key, value) {
    this.#values.set(String(key), String(value));
  }
}

async function collectSourceFiles(roots) {
  const files = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === ".next" ||
          entry.name === "sources"
        ) {
          continue;
        }
        await walk(full);
      } else if (/\.(ts|tsx|js|jsx|mjs|css|md|json)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }
  for (const root of roots) {
    await walk(root);
  }
  return files;
}


async function importDeviceLab() {
  const directory = await mkdtemp(join(tmpdir(), "argos-p11-device-lab-"));
  const files = [
    "lib/device-lab/types.ts",
    "lib/device-lab/shared-claim-control.ts",
    "lib/device-lab/validation.ts",
    "lib/device-lab/8k.ts",
    "lib/device-lab/contactless-lite.ts",
    "lib/device-lab/devices.ts",
    "lib/device-lab/index.ts",
  ];
  for (const file of files) {
    let source = await readFile(file, "utf8");
    source = source
      .replaceAll('"./types"', '"./types.ts"')
      .replaceAll('"./shared-claim-control"', '"./shared-claim-control.ts"')
      .replaceAll('"./validation"', '"./validation.ts"')
      .replaceAll('"./8k"', '"./8k.ts"')
      .replaceAll('"./contactless-lite"', '"./contactless-lite.ts"')
      .replaceAll('"./devices"', '"./devices.ts"')
      .replaceAll('"./local-practice"', '"./local-practice.ts"');
    await writeFile(join(directory, file.split("/").at(-1)), source);
  }
  return import(`${join(directory, "devices.ts")}?v=${Date.now()}`);
}

async function importWordsContent() {
  const directory = await mkdtemp(join(tmpdir(), "argos-p11-words-"));
  const files = [
    "lib/phase-seven-content.ts",
    "lib/phase-eight-content.ts",
    "lib/words-content.ts",
  ];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const patchedSource = source
      .replace("./phase-eight-content", "./phase-eight-content.ts")
      .replace("./phase-seven-content", "./phase-seven-content.ts");
    await writeFile(join(directory, file.split("/").at(-1)), patchedSource);
  }
  return import(`${join(directory, "words-content.ts")}?v=${Date.now()}`);
}

test("P11 acceptance: 90-day Words runtime is deterministic 90 x 10", async () => {
  const { ACTIVE_DAILY_WORD_COUNT, TARGET_DAILY_WORD_COUNT, dayWords } =
    await importWordsContent();

  assert.equal(ACTIVE_DAILY_WORD_COUNT, 5);
  assert.equal(TARGET_DAILY_WORD_COUNT, 10);
  assert.equal(dayWords.length, 90);
  assert.equal(
    dayWords.reduce((total, day) => total + day.words.length, 0),
    900,
  );

  for (const dayContent of dayWords) {
    assert.equal(dayContent.words.length, 10);
    const roles = dayContent.words.map((item) => item.role);
    assert.equal(roles.filter((role) => role === "active").length, 5);
    assert.equal(roles.filter((role) => role === "support-review").length, 5);
  }
});

test("P11 acceptance: legacy fixture migration + export/import round-trip", () => {
  const legacyPractice = {
    version: 1,
    days: {
      3: {
        dayNumber: 3,
        listenOutput: "legacy note",
        wordsOutput: "filter",
        speakFirstTry: "try one",
        speakSecondTry: "",
        reviewAnswers: {},
        completedTasks: ["listen", "words"],
        dailyNote: "old fixture",
        difficultPart: "",
        nextReviewNote: "",
        updatedAt: "2026-07-01T10:00:00.000Z",
      },
    },
  };

  const completeSource = new MemoryStorage();
  completeSource.setItem(ACTIVE_DAY_STORAGE_KEY, "3");
  completeSource.setItem(
    PRACTICE_PROGRESS_STORAGE_KEY,
    JSON.stringify(legacyPractice),
  );
  completeSource.setItem(
    DEVICE_LAB_PRACTICE_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      modules: {
        "8k:8k-intro": {
          deviceSlug: "8k",
          moduleId: "8k-intro",
          completedAt: "2026-07-01T11:00:00.000Z",
          updatedAt: "2026-07-01T11:00:00.000Z",
        },
      },
    }),
  );
  completeSource.setItem(CLOUD_SYNC_LAST_SYNC_STORAGE_KEY, "metadata-only");
  completeSource.setItem("sb-example-auth-token", "secret-must-not-export");

  const completeJson = exportLocalBackupAsJson(completeSource);
  assert.equal(completeJson.includes("secret-must-not-export"), false);
  assert.equal(completeJson.includes("metadata-only"), false);

  const migrated = new MemoryStorage();
  migrated.setItem(ACTIVE_DAY_STORAGE_KEY, "1");
  const completeResult = importLocalBackupFromJson(completeJson, migrated);
  assert.equal(completeResult.ok, true);
  assert.equal(completeResult.format, "complete");
  assert.equal(completeResult.activeDay, 3);
  assert.equal(migrated.getItem(ACTIVE_DAY_STORAGE_KEY), "3");

  const legacyTarget = new MemoryStorage();
  legacyTarget.setItem(ACTIVE_DAY_STORAGE_KEY, "9");
  legacyTarget.setItem(
    DEVICE_LAB_PRACTICE_STORAGE_KEY,
    JSON.stringify({ version: 1, modules: { keep: { moduleId: "keep" } } }),
  );
  const legacyResult = importLocalBackupFromJson(
    JSON.stringify(legacyPractice),
    legacyTarget,
  );
  assert.equal(legacyResult.ok, true);
  assert.equal(legacyResult.format, "legacy-practice");
  assert.equal(legacyTarget.getItem(ACTIVE_DAY_STORAGE_KEY), "9");
  assert.ok(
    JSON.parse(legacyTarget.getItem(DEVICE_LAB_PRACTICE_STORAGE_KEY)).modules
      .keep,
  );
  assert.deepEqual(
    JSON.parse(legacyTarget.getItem(PRACTICE_PROGRESS_STORAGE_KEY)).days["3"]
      .completedTasks,
    ["listen", "words"],
  );

  const invalid = importLocalBackupFromJson("{not-json", new MemoryStorage());
  assert.equal(invalid.ok, false);
});

test("P11 acceptance: retired Auth/Admin/cloud route/import/package scan is zero", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  for (const name of Object.keys(deps)) {
    assert.equal(
      name.startsWith("@supabase/"),
      false,
      `Unexpected Supabase package: ${name}`,
    );
  }

  const files = await collectSourceFiles(["app", "components", "lib"]);
  const forbiddenPatterns = [
    { re: /@\/lib\/auth\b/, label: "@/lib/auth" },
    { re: /@\/lib\/admin\b/, label: "@/lib/admin" },
    { re: /@\/lib\/supabase\b/, label: "@/lib/supabase" },
    { re: /@supabase\//, label: "@supabase/" },
    { re: /from ["']next-auth/, label: "next-auth" },
    {
      re: /createBrowserClient|createServerClient/,
      label: "supabase client helpers",
    },
  ];
  const hits = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    for (const pattern of forbiddenPatterns) {
      if (pattern.re.test(text)) {
        hits.push(`${file}: ${pattern.label}`);
      }
    }
  }
  assert.deepEqual(hits, [], `Retired cloud/auth hits:\n${hits.join("\n")}`);

  for (const routeDir of ["app/login", "app/account", "app/admin"]) {
    try {
      await readdir(routeDir);
      assert.fail(`${routeDir} should not exist`);
    } catch (error) {
      assert.equal(error.code, "ENOENT", `${routeDir} unexpected error`);
    }
  }

  const settings = await readFile("app/settings/page.tsx", "utf8");
  for (const phrase of [
    "Giriş yap",
    "Cloud sync",
    "Supabase",
    "Admin paneli",
    "/login",
    "/admin",
  ]) {
    assert.equal(
      settings.includes(phrase),
      false,
      `Settings still mentions retired phrase: ${phrase}`,
    );
  }
});

test("P11 acceptance: Device Lab publishes only source-backed learner-ready facts", async () => {
  const {
    deviceLabDevices,
    getDeviceLabQuickFacts,
    getLearnerReadyDeviceLabModules,
    learnerReadyDeviceLabDevices,
    deviceLabValidationResult,
  } = await importDeviceLab();
  const validation = deviceLabValidationResult;
  assert.equal(
    validation.valid,
    true,
    JSON.stringify(validation.issues, null, 2),
  );

  assert.deepEqual(
    learnerReadyDeviceLabDevices.map((device) => device.slug),
    ["8k"],
  );

  const readyModules = getLearnerReadyDeviceLabModules("8k");
  assert.deepEqual(
    readyModules.map((labModule) => labModule.id),
    ["8k-intro"],
  );

  for (const labModule of readyModules) {
    assert.equal(labModule.releaseStatus, "learner_ready");
    assert.ok(labModule.sourceBackedClaims.length > 0);
    const facts = getDeviceLabQuickFacts(labModule);
    assert.ok(facts.length > 0);
    assert.ok(facts.length <= 3);
    for (const claim of facts) {
      assert.equal(claim.releaseStatus, "learner_ready");
      assert.equal(claim.learnerFacingTextAllowed, true);
      assert.notEqual(claim.claimControlLevel, "blocked");
      assert.notEqual(claim.claimControlLevel, "not_enough_source_data");
      assert.notEqual(claim.claimControlLevel, "conflict_follow_up_needed");
      assert.ok(claim.sourceReferences.length > 0);
      for (const reference of claim.sourceReferences) {
        assert.ok(reference.sourceFile.trim());
        assert.ok(reference.section.trim());
        assert.ok(reference.slideOrPage.trim());
        assert.ok(reference.note.trim());
      }
    }
  }

  for (const device of deviceLabDevices) {
    if (device.slug === "8k") continue;
    const published = getLearnerReadyDeviceLabModules(device.slug);
    assert.equal(
      published.length,
      0,
      `${device.slug} must not publish learner_ready modules yet`,
    );
  }
});

test("P11 acceptance: shared CTA variants keep explicit contrast/focus/target contract", async () => {
  const ui = await readFile("components/ui.tsx", "utf8");
  assert.match(ui, /min-h-11/);
  assert.match(ui, /focus-visible:ring-\[3px\]/);
  assert.match(ui, /focus-visible:ring-clay/);
  assert.match(ui, /text-action-primary-text/);
  assert.match(ui, /bg-action-primary/);
  assert.match(ui, /disabled:bg-control-disabled/);
  assert.match(ui, /disabled:text-text-secondary/);
  assert.match(ui, /hover:bg-action-primary-hover/);
  assert.match(ui, /active:bg-action-primary-active/);
  assert.match(ui, /visited:text-action-primary-text/);
  assert.match(ui, /isLoading/);

  const globals = await readFile("app/globals.css", "utf8");
  assert.match(globals, /--action-primary:\s*#17201a/i);
  assert.match(globals, /--action-primary-text:\s*#ffffff/i);
  assert.match(globals, /--focus-ring:\s*#8f4f38/i);
  assert.match(globals, /--control-disabled:\s*#d7d0c6/i);
  assert.match(globals, /--text-secondary:\s*#3f493f/i);

  function hexToRgb(hex) {
    const value = hex.replace("#", "");
    return {
      r: Number.parseInt(value.slice(0, 2), 16) / 255,
      g: Number.parseInt(value.slice(2, 4), 16) / 255,
      b: Number.parseInt(value.slice(4, 6), 16) / 255,
    };
  }
  function channel(c) {
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }
  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }
  function contrast(fg, bg) {
    const L1 = luminance(fg);
    const L2 = luminance(bg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  assert.ok(contrast("#ffffff", "#17201a") >= 4.5);
  assert.ok(contrast("#ffffff", "#33493a") >= 4.5);
  assert.ok(contrast("#ffffff", "#26372c") >= 4.5);
  assert.ok(contrast("#3f493f", "#d7d0c6") >= 4.5);
});

test("P11 acceptance: recording MIME/fallback/error/cleanup contract remains intact", async () => {
  assert.equal(
    selectVoiceRecorderMimeType(() => true),
    "audio/webm;codecs=opus",
  );
  assert.equal(
    selectVoiceRecorderMimeType((mimeType) => mimeType === "audio/mp4"),
    "audio/mp4",
  );
  assert.equal(selectVoiceRecorderMimeType(() => false), undefined);
  assert.equal(VOICE_RECORDING_MAX_SECONDS, 90);
  assert.equal(VOICE_RECORDER_PERMISSION_TIMEOUT_MS, 15_000);
  assert.match(
    getVoiceRecordingErrorMessage({ name: "NotAllowedError" }),
    /izni verilmedi/i,
  );
  assert.match(
    getVoiceRecordingErrorMessage({ name: "NotSupportedError" }),
    /desteklenen/i,
  );

  const component = await readFile("components/voice-recorder.tsx", "utf8");
  for (const marker of [
    "track.stop()",
    "URL.revokeObjectURL",
    "URL.createObjectURL",
    "Kaydı başlat",
    "buluta yüklenmez",
  ]) {
    assert.ok(component.includes(marker), `missing ${marker}`);
  }
  for (const forbidden of [
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "fetch(",
  ]) {
    assert.equal(
      component.includes(forbidden),
      false,
      `must not use ${forbidden}`,
    );
  }
});

test("P11 acceptance: architecture/usage/privacy docs describe single-user local model", async () => {
  const docs = [
    "README.md",
    "docs/ARGOS_SPEAK_90_ARCHITECTURE.md",
    "docs/ARGOS_SPEAK_90_USAGE.md",
    "docs/ARGOS_SPEAK_90_PRIVACY.md",
    "AGENTS.md",
  ];
  for (const doc of docs) {
    const text = await readFile(doc, "utf8");
    assert.match(text, /tek kullan/i);
    assert.match(text, /yerel/i);
  }

  const privacy = await readFile("docs/ARGOS_SPEAK_90_PRIVACY.md", "utf8");
  assert.match(privacy, /mikrofon/i);
  assert.match(privacy, /oturum/i);
  assert.match(privacy, /localStorage|yerel depolama|yerel saklama/i);
  assert.match(privacy, /ElevenLabs|TTS|ses/i);
  assert.equal(privacy.toLowerCase().includes("supabase"), false);
});
