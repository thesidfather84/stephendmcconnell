export function AwaitingReview({
  label = "Awaiting Stephen's Review",
  description,
}: {
  label?: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-mist p-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-medical">
        {label}
      </p>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
