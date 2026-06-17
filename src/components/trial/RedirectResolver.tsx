import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trialLinkService } from "@/services/trialLinkService";
import type { Platform, TrialLink, TrialMode } from "@/types/trial";
import { formatDate } from "@/utils/formatDate";

// MOCK REDIRECT PAGE
// In production, these routes should be handled by a Cloud Function (or
// equivalent server route) that 302-redirects to the current target URL for
// the (mode, platform) pair. We render a manual "Continue" button instead so
// nothing unsafe auto-navigates while in mock mode.

type Props = { mode: TrialMode; platform: Platform };

export function RedirectResolver({ mode, platform }: Props) {
  const [link, setLink] = useState<TrialLink | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    trialLinkService
      .get(mode, platform)
      .then((l: TrialLink | undefined) => {
        if (!alive) return;
        setLink(l ?? null);
        if (l?.targetUrl) {
          // Auto-redirect to the latest variable URL from the sheet.
          window.location.replace(l.targetUrl);
        }
      })
      .catch(() => alive && setLink(null));
    return () => {
      alive = false;
    };
  }, [mode, platform]);

  const platformLabel = platform === "android" ? "Android" : "iOS";
  const modeLabel = mode === "internal" ? "Internal" : "External";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {modeLabel} {platformLabel} trial
          </CardTitle>
          <CardDescription>
            {link === undefined
              ? "Resolving latest trial build…"
              : link
                ? "Latest build resolved."
                : "Trial build not configured."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {link && (
            <>
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Version</dt>
                <dd className="font-medium">{link.version}</dd>
                <dt className="text-muted-foreground">Updated</dt>
                <dd>{formatDate(link.updatedAt)}</dd>
                <dt className="text-muted-foreground">Target</dt>
                <dd className="break-all font-mono text-xs">{link.targetUrl}</dd>
              </dl>
              <Button asChild className="w-full">
                <a href={link.targetUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Continue to trial build
                </a>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}