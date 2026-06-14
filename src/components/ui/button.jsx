import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-none font-[Fredoka] font-semibold whitespace-nowrap transition-all outline-none select-none active:translate-y-[4px] focus-visible:ring-4 focus-visible:ring-white/80 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-sky-400 text-white hover:bg-sky-500 shadow-[0_5px_0_#0284c7] active:shadow-[0_1px_0_#0284c7]",
        cosmos:
          "bg-gradient-to-r from-cosmos-purple via-cosmos-blue to-cosmos-cyan text-white hover:brightness-105 shadow-[0_5px_0_#0b3a8f] active:shadow-[0_1px_0_#0b3a8f]",
        sunset:
          "bg-gradient-to-r from-cosmos-pink via-cosmos-orange to-cosmos-yellow text-white hover:brightness-105 shadow-[0_5px_0_#c43d6e] active:shadow-[0_1px_0_#c43d6e]",
        success:
          "bg-green-400 text-white hover:bg-green-500 shadow-[0_5px_0_#16a34a] active:shadow-[0_1px_0_#16a34a]",
        danger:
          "bg-rose-400 text-white hover:bg-rose-500 shadow-[0_5px_0_#e11d48] active:shadow-[0_1px_0_#e11d48]",
        grape:
          "bg-purple-400 text-white hover:bg-purple-500 shadow-[0_5px_0_#9333ea] active:shadow-[0_1px_0_#9333ea]",
        sun:
          "bg-amber-400 text-white hover:bg-amber-500 shadow-[0_5px_0_#d97706] active:shadow-[0_1px_0_#d97706]",
        coral:
          "bg-orange-400 text-white hover:bg-orange-500 shadow-[0_5px_0_#ea580c] active:shadow-[0_1px_0_#ea580c]",
        outline:
          "bg-white text-sky-600 border-4 border-sky-300 hover:bg-sky-50 shadow-[0_5px_0_#bae6fd] active:shadow-[0_1px_0_#bae6fd]",
        secondary:
          "bg-white text-purple-600 hover:bg-purple-50 shadow-[0_5px_0_#e9d5ff] active:shadow-[0_1px_0_#e9d5ff]",
        ghost:
          "shadow-none active:translate-y-0 text-purple-600 hover:bg-purple-100",
        link: "shadow-none active:translate-y-0 text-sky-500 underline-offset-4 hover:underline",
        destructive:
          "bg-rose-400 text-white hover:bg-rose-500 shadow-[0_5px_0_#e11d48] active:shadow-[0_1px_0_#e11d48]",
      },
      size: {
        default: "h-14 px-7 text-xl",
        xs: "h-9 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        sm: "h-11 px-5 text-base",
        lg: "h-16 px-9 text-2xl",
        xl: "h-20 px-12 text-3xl",
        icon: "size-14",
        "icon-sm": "size-11",
        "icon-lg": "size-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
