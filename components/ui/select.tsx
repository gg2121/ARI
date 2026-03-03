"use client";
import * as React from "react";

const SelectCtx = React.createContext<{ value: string; setValue: (v: string) => void } | null>(null);

export function Select({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) {
  return <SelectCtx.Provider value={{ value, setValue: onValueChange }}>{children}</SelectCtx.Provider>;
}

export function SelectTrigger({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className}>{children}</div>;
}
export function SelectValue() { return null; }

export function SelectContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SelectCtx)!;
  // We render a real select using children from SelectItem
  const items = React.Children.toArray(children).filter(Boolean) as any[];
  return (
    <select
      value={ctx.value}
      onChange={(e) => ctx.setValue(e.target.value)}
      className="select w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
    >
      {items.map((it) => it)}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}