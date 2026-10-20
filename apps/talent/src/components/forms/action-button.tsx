"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ApiResult } from "@/lib/api/result";
import { settle } from "./feedback";

type Confirm = { title: string; description: string; confirmLabel: string; destructive?: boolean };

/**
 * Runs a server action on click (optionally after a confirm dialog), with a
 * pending state and toast feedback. Pass a bound server action from a Server
 * Component, e.g. action={respondToOffer.bind(null, id, "accept")}.
 */
export function ActionButton({
  action,
  success,
  confirm,
  children,
  variant = "brand",
  size = "cta",
  className,
  disabled,
}: {
  action: () => Promise<ApiResult<unknown>>;
  success?: string;
  confirm?: Confirm;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & VariantProps<typeof buttonVariants>) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const run = () =>
    startTransition(async () => {
      const result = await action();
      if (settle(result, { success })) setOpen(false);
    });

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || pending}
      onClick={confirm ? () => setOpen(true) : run}
    >
      {pending && <Loader2 className="animate-spin" aria-hidden />}
      {children}
    </Button>
  );

  if (!confirm) return button;

  return (
    <>
      {button}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">{confirm.title}</DialogTitle>
            <DialogDescription className="leading-6">{confirm.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="h-9 rounded-xl px-4" />}>Cancel</DialogClose>
            <Button
              type="button"
              variant={confirm.destructive ? "destructive" : "brand"}
              className="h-9 px-4"
              disabled={pending}
              onClick={run}
            >
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {confirm.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
