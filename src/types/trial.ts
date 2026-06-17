export type TrialMode = "internal" | "external";
export type Platform = "android" | "ios";

export type TrialLink = {
  mode: TrialMode;
  platform: Platform;
  targetUrl: string;
  stableRedirectPath: string;
  version: string;
  updatedAt: string;
};

export type TrialLinkKey = `${TrialMode}_${Platform}`;

export const trialKey = (mode: TrialMode, platform: Platform): TrialLinkKey =>
  `${mode}_${platform}` as TrialLinkKey;