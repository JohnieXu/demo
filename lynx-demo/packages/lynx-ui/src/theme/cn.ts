import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Array<string | undefined | false | Record<string, boolean>>): string {
  return twMerge(clsx(inputs))
}
