import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-full border-4 border-amber-200 bg-amber-50 px-6 font-[Fredoka] text-xl text-purple-900 outline-none transition-colors placeholder:text-purple-300 focus-visible:border-amber-400 focus-visible:ring-4 focus-visible:ring-amber-200/60 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Input }
