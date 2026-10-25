"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors outline-none after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-brand-600 data-unchecked:bg-slate-200 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(11,21,51,0.25)] transition-transform duration-200 data-checked:translate-x-5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
