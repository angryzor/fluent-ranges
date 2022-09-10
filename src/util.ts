import type { FluentValue } from '@fluent/bundle';

export function values(
  opts: Record<string, FluentValue>,
  allowed: Array<string>
): Record<string, unknown> {
  const unwrapped = Object.create(null) as Record<string, unknown>;
  for (const [name, opt] of Object.entries(opts)) {
    if (allowed.includes(name)) {
      unwrapped[name] = opt.valueOf();
    }
  }
  return unwrapped;
}
