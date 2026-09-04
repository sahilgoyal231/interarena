import React from "react";
import { Label } from "./label";

interface FormGroupProps {
  label: string;
  labelClassName?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function FormGroup({ label, labelClassName, htmlFor, children }: FormGroupProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className={`text-sm font-bold ${labelClassName || "text-zinc-300"}`}>
        {label}
      </Label>
      {children}
    </div>
  );
}
