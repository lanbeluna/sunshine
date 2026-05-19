import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-pencil-line placeholder:text-ink-light",
        "focus-visible:border-mint focus-visible:ring-mint/35 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "flex field-sizing-content min-h-24 w-full rounded-xl border bg-paper-dark px-4 py-3 text-base font-serif shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
