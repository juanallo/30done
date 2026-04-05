/**
 * Bump when challenge image bytes change so browsers and the service worker
 * pick up new assets (cache bust via query string).
 */
export const CHALLENGE_ASSETS_VERSION = "1.2.3" as const;

export function challengeAsset(filename: string): string {
  return `/challenges/${encodeURIComponent(filename)}?v=${CHALLENGE_ASSETS_VERSION}`;
}
