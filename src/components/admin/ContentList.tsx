import { GeneratedItem, KIND_LABELS } from "@/data/generated-content";
import { setContentStatusAction, deleteContentAction } from "@/lib/admin-content-actions";

export function ContentList({
  items,
  variant,
}: {
  items: GeneratedItem[];
  variant: "draft" | "published";
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="font-semibold text-navy">
          {variant === "draft" ? "No drafts yet" : "Nothing published yet"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {variant === "draft"
            ? "Content you save without publishing will show up here."
            : "Content you publish from the dashboard will show up here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-medical">
              {KIND_LABELS[item.kind]}
            </p>
            <p className="mt-1 font-bold text-navy">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(item.updatedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <form action={setContentStatusAction}>
              <input type="hidden" name="id" value={item.id} />
              <input
                type="hidden"
                name="newStatus"
                value={variant === "draft" ? "published" : "draft"}
              />
              <button
                type="submit"
                className="rounded-full bg-medical px-4 py-2 text-sm font-semibold text-white hover:bg-medical-dark"
              >
                {variant === "draft" ? "Publish" : "Unpublish"}
              </button>
            </form>

            <form action={deleteContentAction}>
              <input type="hidden" name="id" value={item.id} />
              <input
                type="hidden"
                name="returnTo"
                value={variant === "draft" ? "/admin/drafts" : "/admin/published"}
              />
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-rose-400 hover:text-rose-600"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
