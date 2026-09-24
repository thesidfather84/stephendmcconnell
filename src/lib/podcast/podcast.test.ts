// @vitest-environment node
import { describe, expect, it, beforeEach } from "vitest";
import {
  sortEpisodesNewestFirst,
  upsertEpisode,
  type PublicPodcastEpisode,
} from "@/data/podcast-episodes";
import { createSessionValue, isSessionValue, passcodeMatches, getStudioAuthConfigProblems } from "./auth";
import { hasAnythingGoneLive, statusLabel, todayInEastern, type EpisodeView } from "./status";
import { cleanForYoutube } from "./youtube";

const ep = (over: Partial<PublicPodcastEpisode>): PublicPodcastEpisode => ({
  id: "a",
  title: "T",
  description: "",
  date: "2026-01-01",
  publishedAt: "2026-01-01T10:00:00Z",
  ...over,
});

const view = (over: Partial<EpisodeView> = {}): EpisodeView => ({
  id: "1",
  title: "",
  description: "",
  date: "2026-01-01",
  status: "setup",
  errorMessage: null,
  durationSeconds: null,
  hasRecording: false,
  guestLinksCreated: 0,
  websiteStatus: "none",
  websiteError: null,
  ...over,
});

describe("public episode ordering", () => {
  it("puts the newest date first and newest-published first on the same day", () => {
    const sorted = sortEpisodesNewestFirst([
      ep({ id: "old", date: "2026-01-01" }),
      ep({ id: "same-early", date: "2026-02-01", publishedAt: "2026-02-01T09:00:00Z" }),
      ep({ id: "same-late", date: "2026-02-01", publishedAt: "2026-02-01T18:00:00Z" }),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(["same-late", "same-early", "old"]);
  });

  it("replaces an entry with the same id instead of duplicating it on retry", () => {
    const list = upsertEpisode([ep({ id: "x", title: "Old" })], ep({ id: "x", title: "New" }));
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("New");
  });
});

describe("studio status", () => {
  it("never shows Published unless the episode is published", () => {
    expect(statusLabel(view({ status: "draft" }), false)).toBe("Stopped");
    expect(statusLabel(view({ status: "published" }), false)).toBe("Published");
  });

  it("reports failures and uploads honestly", () => {
    expect(statusLabel(view({ status: "draft", websiteStatus: "failed" }), false)).toBe("Error");
    expect(statusLabel(view({ status: "processing" }), false)).toBe("Uploading");
    expect(statusLabel(view({ status: "recording" }), false)).toBe("Recording");
    expect(statusLabel(view(), true)).toBe("Testing");
    expect(statusLabel(view(), false)).toBe("Ready");
  });

  it("treats anything already on the website as un-discardable", () => {
    expect(hasAnythingGoneLive(view({ status: "draft" }))).toBe(false);
    expect(hasAnythingGoneLive(view({ status: "draft", websiteStatus: "published" }))).toBe(true);
    expect(hasAnythingGoneLive(view({ status: "draft", websiteStatus: "published" }))).toBe(true);
    expect(hasAnythingGoneLive(view({ status: "published" }))).toBe(true);
  });

  it("formats today's date as YYYY-MM-DD in Eastern time", () => {
    expect(todayInEastern(new Date("2026-03-05T03:00:00Z"))).toBe("2026-03-04");
  });
});

describe("studio login session", () => {
  beforeEach(() => {
    process.env.PODCAST_STUDIO_PASSCODE = "4821";
    process.env.PODCAST_STUDIO_SESSION_SECRET = "x".repeat(40);
  });

  it("accepts only the configured 4-digit code", () => {
    expect(passcodeMatches("4821")).toBe(true);
    expect(passcodeMatches("4822")).toBe(false);
    expect(passcodeMatches("")).toBe(false);
  });

  it("flags a missing or malformed passcode", () => {
    process.env.PODCAST_STUDIO_PASSCODE = "12";
    expect(getStudioAuthConfigProblems()).toHaveLength(1);
  });

  it("accepts a fresh signed session and rejects tampered or expired ones", () => {
    const now = Date.now();
    const value = createSessionValue(now);
    expect(isSessionValue(value, now)).toBe(true);
    expect(isSessionValue(value, now + 3 * 60 * 60 * 1000)).toBe(true);
    expect(isSessionValue(value, now + 5 * 60 * 60 * 1000)).toBe(false);
    const [expires] = value.split(".");
    expect(isSessionValue(`${Number(expires) + 99999999}.${value.split(".")[1]}`, now)).toBe(false);
    expect(isSessionValue(undefined, now)).toBe(false);
  });
});

describe("YouTube text cleaning", () => {
  it("strips characters YouTube rejects and enforces length", () => {
    expect(cleanForYoutube("  a <b> c ", 100)).toBe("a b c");
    expect(cleanForYoutube("x".repeat(200), 100)).toHaveLength(100);
  });
});
