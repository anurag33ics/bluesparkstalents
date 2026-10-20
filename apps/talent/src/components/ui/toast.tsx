"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cn } from "cn"
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, XIcon } from "lucide-react"

const toastManager = ToastPrimitive.createToastManager()

/** Imperative API usable from any client component under <Toaster />. */
const toast = {
  success(title: string, description?: string) {
    return toastManager.add({ title, description, type: "success" })
  },
  error(title: string, description?: string) {
    return toastManager.add({ title, description, type: "error", priority: "high" })
  },
  info(title: string, description?: string) {
    return toastManager.add({ title, description, type: "info" })
  },
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()
  return toasts.map((item) => (
    <ToastPrimitive.Root
      key={item.id}
      toast={item}
      data-slot="toast"
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl bg-popover p-3.5 pr-10 text-sm text-popover-foreground shadow-lg shadow-brand-900/10 ring-1 ring-foreground/10 transition-all duration-200 ease-out select-none",
        "data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:opacity-0 data-limited:hidden"
      )}
    >
      {item.type === "error" ? (
        <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      ) : item.type === "info" ? (
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
      ) : (
        <CircleCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
      )}
      <ToastPrimitive.Content className="flex min-w-0 flex-1 flex-col gap-0.5">
        <ToastPrimitive.Title className="font-medium text-foreground" />
        <ToastPrimitive.Description className="text-muted-foreground" />
      </ToastPrimitive.Content>
      <ToastPrimitive.Close
        aria-label="Dismiss notification"
        className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <XIcon className="size-3.5" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  ))
}

function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} limit={3}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[60] flex w-[calc(100vw-2rem)] flex-col gap-2 outline-none sm:right-6 sm:bottom-6 sm:w-96">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

export { Toaster, toast }
