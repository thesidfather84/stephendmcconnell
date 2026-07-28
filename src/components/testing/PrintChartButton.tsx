"use client";

export function PrintChartButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
    >
      Print This Chart
    </button>
  );
}
