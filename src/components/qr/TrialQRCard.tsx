import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Smartphone, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { TrialLink, Platform } from "@/types/trial";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { formatDate } from "@/utils/formatDate";
import { getSiteOrigin } from "@/utils/siteUrl";

type Props = {
  link?: TrialLink;
  platform: Platform;
};

export function TrialQRCard({ link, platform }: Props) {
  const platformLabel = platform === "android" ? "Android" : "iOS";
  const Icon = Smartphone;
  const stableUrl = link ? `${getSiteOrigin()}${link.stableRedirectPath}` : "";
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (!link) {
      setRevealed(false);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 120);
    return () => clearTimeout(t);
  }, [link]);

  async function handleCopyStable() {
    if (!link) return;
    const ok = await copyToClipboard(stableUrl);
    toast[ok ? "success" : "error"](
      ok ? `${platformLabel} stable link copied` : "Failed to copy link",
    );
  }

  function handleOpenTarget() {
    if (!link) return;
    window.open(link.targetUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" aria-hidden />
          <span>{platformLabel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-md border bg-white p-3">
          {link ? (
            <div
              className={`h-full w-full transition-opacity duration-500 ease-out ${
                revealed ? "opacity-100" : "opacity-0"
              }`}
            >
              <QRCodeSVG value={stableUrl} className="h-full w-full" level="M" includeMargin={false} />
            </div>
          ) : (
            <div className="h-full w-full animate-pulse rounded-sm bg-muted/60" />
          )}
        </div>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Version</dt>
          <dd className="font-medium">
            {link ? link.version : <span className="inline-block h-3 w-16 animate-pulse rounded bg-muted align-middle" />}
          </dd>
          <dt className="text-muted-foreground">Updated</dt>
          <dd>
            {link ? formatDate(link.updatedAt) : <span className="inline-block h-3 w-32 animate-pulse rounded bg-muted align-middle" />}
          </dd>
        </dl>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopyStable} disabled={!link}>
            <Copy className="h-4 w-4" /> Copy {platformLabel} link
          </Button>
          <Button size="sm" onClick={handleOpenTarget} disabled={!link}>
            <ExternalLink className="h-4 w-4" /> Open {platformLabel} trial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}