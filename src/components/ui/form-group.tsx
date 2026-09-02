import React from "react";
import { Label } from "./label";

interface FormGroupProps {
  label: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export function FormGroup({ label, labelClassName, children }: FormGroupProps) {
  return (
    <div className="space-y-2">
      <Label className={`text-sm font-bold ${labelClassName || "text-zinc-300"}`}>
        {label}
      </Label>
      {children}
    </div>
  );
}
