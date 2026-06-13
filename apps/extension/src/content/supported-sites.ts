import { SUPPORTED_SITES } from "@gnomon/shared";

export { SUPPORTED_SITES };

export function isSupportedHost(hostname: string): boolean {
  return SUPPORTED_SITES.some((site) => site.matches.some((match) => hostname.includes(match)));
}

export function getInputSelectors(hostname: string): string[] {
  return (
    SUPPORTED_SITES.find((site) => site.matches.some((match) => hostname.includes(match)))
      ?.inputSelectors ?? []
  );
}
