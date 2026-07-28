const TAG_STYLES: Record<string, string> = {
  "Published Research": "bg-medical/10 text-medical-dark",
  "Educational Article": "bg-mist-dark text-navy",
  "Educational Recommendation": "bg-mist-dark text-navy",
  "Case Observation": "bg-amber-100 text-amber-800",
  Observation: "bg-amber-100 text-amber-800",
  "Emerging Hypothesis": "bg-rose-100 text-rose-700",
  "Stephen's Interpretation": "bg-slate-200 text-slate-700",
  "Review and Commentary": "bg-medical/10 text-medical-dark",
  "Research Discussion": "bg-slate-200 text-slate-700",
  "Educational Material": "bg-mist-dark text-navy",
  "Supporting Literature": "bg-amber-100 text-amber-800",
  "Media Appearance": "bg-indigo-100 text-indigo-700",
};

export function Tag({ label }: { label: string }) {
  const style = TAG_STYLES[label] ?? "bg-slate-200 text-slate-700";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
