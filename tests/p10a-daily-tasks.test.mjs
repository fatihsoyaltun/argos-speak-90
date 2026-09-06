import assert from "node:assert/strict";
import test from "node:test";
import {
  countTrackedCompletions,
  dailyTasks,
  getNextDailyTask,
  hasJournalNotes,
  trackedDailyTasks,
} from "../lib/daily-tasks.ts";

test("dailyTasks expose all five Practice hub areas in order", () => {
  assert.deepEqual(
    dailyTasks.map((task) => task.id),
    ["listen", "words", "speak", "review", "journal"],
  );
  assert.equal(dailyTasks.length, 5);
  assert.equal(trackedDailyTasks.length, 4);
});

test("getNextDailyTask returns the first incomplete tracked task", () => {
  assert.equal(getNextDailyTask([])?.id, "listen");
  assert.equal(getNextDailyTask(["listen"])?.id, "words");
  assert.equal(getNextDailyTask(["listen", "words"])?.id, "speak");
  assert.equal(getNextDailyTask(["listen", "words", "speak"])?.id, "review");
  assert.equal(
    getNextDailyTask(["listen", "words", "speak", "review"]),
    null,
  );
  assert.equal(getNextDailyTask(["words"])?.id, "listen");
});

test("tracked completion count ignores journal notes", () => {
  assert.equal(countTrackedCompletions(["listen", "review"]), 2);
  assert.equal(
    countTrackedCompletions(["listen", "words", "speak", "review"]),
    4,
  );
  assert.equal(
    hasJournalNotes({
      dailyNote: "ok",
      difficultPart: "",
      nextReviewNote: "",
    }),
    true,
  );
  assert.equal(
    hasJournalNotes({
      dailyNote: "  ",
      difficultPart: "",
      nextReviewNote: "",
    }),
    false,
  );
});

test("journal is not a completedTasks key", () => {
  for (const task of trackedDailyTasks) {
    assert.ok(task.completionKey);
    assert.notEqual(task.completionKey, "journal");
  }
  const journal = dailyTasks.find((task) => task.id === "journal");
  assert.equal(journal?.completionKey, null);
});
