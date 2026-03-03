import * as React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 ${
        props.className ?? ""
      }`}
    />
  );
}