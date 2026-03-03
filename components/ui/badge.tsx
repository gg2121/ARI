import * as React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "secondary" | "outline";
};

export function Badge({ variant = "secondary", className = "", ...props }: Props) {
  const base = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs";
  const styles =
    variant === "outline"
      ? "border bg-white text-gray-900"
      : "bg-gray-100 text-gray-900";
  return <span className={`${base} ${styles} ${className}`} {...props} />;
}