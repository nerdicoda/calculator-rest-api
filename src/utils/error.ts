export function handleError(error: unknown, message: string): never {
  if (error instanceof Error) {
    throw new Error(`${message}: ${error.message}`);
  }
  throw error;
}
