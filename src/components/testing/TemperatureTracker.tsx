"use client";

import { useEffect, useState } from "react";

type Reading = { date: string; temperature: number };

const STORAGE_KEY = "barnes-temperature-log";

function loadReadings(): Reading[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reading[]) : [];
  } catch {
    return [];
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TemperatureTracker() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [date, setDate] = useState(todayISO());
  const [temperature, setTemperature] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reading localStorage isn't available during server rendering, so it's
    // synced in on mount rather than used as the initial state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadings(loadReadings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
    }
  }, [readings, loaded]);

  function addReading(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(temperature);
    if (Number.isNaN(value) || !date) return;

    setReadings((prev) => {
      const withoutSameDate = prev.filter((r) => r.date !== date);
      return [...withoutSameDate, { date, temperature: value }].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    });
    setTemperature("");
  }

  function removeReading(dateToRemove: string) {
    setReadings((prev) => prev.filter((r) => r.date !== dateToRemove));
  }

  function clearAll() {
    if (window.confirm("Remove all saved temperature readings from this browser?")) {
      setReadings([]);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={addReading} className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="temp-date" className="block text-sm font-semibold text-navy">
            Date
          </label>
          <input
            id="temp-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 rounded-lg border border-slate-300 px-4 py-2.5 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
          />
        </div>
        <div>
          <label htmlFor="temp-value" className="block text-sm font-semibold text-navy">
            Temperature (&deg;F)
          </label>
          <input
            id="temp-value"
            type="number"
            step="0.1"
            placeholder="97.8"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            required
            className="mt-1 w-32 rounded-lg border border-slate-300 px-4 py-2.5 focus:border-medical focus:outline-none focus:ring-1 focus:ring-medical"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-medical px-6 py-2.5 font-semibold text-white hover:bg-medical-dark"
        >
          Add Reading
        </button>
      </form>

      {readings.length === 0 ? (
        <p className="text-sm text-slate-500">
          No readings saved yet. Readings are stored only in this browser, on this device.
        </p>
      ) : (
        <>
          <TemperatureGraph readings={readings} />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4 font-semibold">Date</th>
                  <th className="py-2 pr-4 font-semibold">Temperature (&deg;F)</th>
                  <th className="py-2 font-semibold">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.date} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-700">{r.date}</td>
                    <td className="py-2 pr-4 text-slate-700">{r.temperature.toFixed(1)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeReading(r.date)}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="no-print text-sm font-semibold text-slate-400 hover:text-rose-600"
          >
            Clear all readings
          </button>
        </>
      )}

      <p className="text-xs text-slate-400">
        Readings are saved only in this browser&apos;s local storage &mdash; they are not sent
        anywhere and will not appear on any other device.
      </p>
    </div>
  );
}

function TemperatureGraph({ readings }: { readings: Reading[] }) {
  if (readings.length < 2) {
    return (
      <p className="text-sm text-slate-500">
        Add at least two readings to see your graph.
      </p>
    );
  }

  const width = 640;
  const height = 220;
  const padding = 32;

  const temps = readings.map((r) => r.temperature);
  const min = Math.min(...temps) - 0.2;
  const max = Math.max(...temps) + 0.2;

  const xStep = (width - padding * 2) / Math.max(1, readings.length - 1);
  const yScale = (value: number) =>
    height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);

  const points = readings.map((r, i) => `${padding + i * xStep},${yScale(r.temperature)}`);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[480px]" role="img" aria-label="Graph of daily temperature readings">
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e4ecf6"
        />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e4ecf6" />
        <polyline points={points.join(" ")} fill="none" stroke="#1d6fd6" strokeWidth={2} />
        {readings.map((r, i) => (
          <circle key={r.date} cx={padding + i * xStep} cy={yScale(r.temperature)} r={3} fill="#0b1f3a" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{readings[0].date}</span>
        <span>{readings[readings.length - 1].date}</span>
      </div>
    </div>
  );
}
