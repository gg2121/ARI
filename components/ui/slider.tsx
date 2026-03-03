"use client";
import * as React from "react";

export function Slider({
  value,
  onValueChange,
  max = 100,
  step = 1
}: {
  value: number[];
  onValueChange: (v: number[]) => void;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="range"
      min={0}
      max={max}
      step={step}
      value={value[0] ?? 0}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className="w-full"
    />
  );
}