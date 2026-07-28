"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import {
  EVIDENCE_LABELS,
  LIBRARY_CATEGORIES,
  LIBRARY_TOPICS,
  LibraryCategory,
  LibraryItem,
  LibraryTopic,
  getSortableTime,
} from "@/data/library";

type SortOption = "newest" | "oldest" | "title";

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <Tag label={EVIDENCE_LABELS[item.category]} />
        <span className="text-sm text-slate-500">
          {item.year ?? (item.status === "published" ? "" : "Coming Soon")}
        </span>
      </div>
      <h2 className="mt-3 text-lg font-bold text-navy">
        <Link href={`/library/${item.slug}`} className="hover:text-medical">
          {item.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-slate-500">{item.authors.join(", ")}</p>
      <p className="mt-3 flex-1 text-sm text-slate-600">{item.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-navy"
          >
            {topic}
          </span>
        ))}
      </div>
      <Link
        href={`/library/${item.slug}`}
        className="mt-4 text-sm font-semibold text-medical hover:underline"
      >
        Read more &rarr;
      </Link>
    </Card>
  );
}

export function LibraryBrowser({ items }: { items: LibraryItem[] }) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Set<LibraryCategory>>(new Set());
  const [topics, setTopics] = useState<Set<LibraryTopic>>(new Set());
  const [sort, setSort] = useState<SortOption>("newest");

  const isDefaultView = search.trim() === "" && categories.size === 0 && topics.size === 0;

  const featured = useMemo(
    () => items.filter((item) => item.featured && item.status === "published"),
    [items]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = items.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.title.toLowerCase().includes(query) ||
        item.authors.join(" ").toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.topics.some((t) => t.toLowerCase().includes(query));

      const matchesCategory = categories.size === 0 || categories.has(item.category);
      const matchesTopic = topics.size === 0 || item.topics.some((t) => topics.has(t));

      return matchesSearch && matchesCategory && matchesTopic;
    });

    if (isDefaultView) {
      result = result.filter((item) => !item.featured);
    }

    result = [...result].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const diff = getSortableTime(b) - getSortableTime(a);
      return sort === "newest" ? diff : -diff;
    });

    return result;
  }, [items, search, categories, topics, sort, isDefaultView]);

  function clearFilters() {
    setSearch("");
    setCategories(new Set());
    setTopics(new Set());
  }

  return (
    <div>
      {isDefaultView && featured.length > 0 && (
        <div className="mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-medical">
            Featured
          </h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {featured.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the research library..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
          aria-label="Search the research library"
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LIBRARY_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategories((prev) => toggleInSet(prev, category))}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  categories.has(category)
                    ? "bg-medical text-white"
                    : "bg-mist text-navy hover:bg-mist-dark"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Topic
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LIBRARY_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setTopics((prev) => toggleInSet(prev, topic))}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  topics.has(topic)
                    ? "bg-medical text-white"
                    : "bg-mist text-navy hover:bg-mist-dark"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
            {isDefaultView && featured.length > 0 ? " (plus featured, above)" : ""}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-slate-600">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-mist p-10 text-center">
            <p className="font-semibold text-navy">No results found</p>
            <p className="mt-1 text-sm text-slate-600">
              Try a different search term, or clear the current filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-full bg-medical px-5 py-2 text-sm font-semibold text-white hover:bg-medical-dark"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
