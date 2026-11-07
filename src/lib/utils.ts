export { cn } from "cn"

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Something went wrong"
