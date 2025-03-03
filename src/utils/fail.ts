export class DescriptiveError extends Error {}

export function fail(message: string, cause?: unknown): never {
    throw new DescriptiveError(message, { cause });
}
