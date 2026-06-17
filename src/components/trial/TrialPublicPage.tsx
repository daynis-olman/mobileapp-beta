import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrialQRCard } from "@/components/qr/TrialQRCard";
import { trialLinkService } from "@/services/trialLinkService";
import type { TrialLink, TrialMode } from "@/types/trial";

type Props = {
  mode: TrialMode;
  title: string;
  description: string;
  showInternalBadge?: boolean;
};

export function TrialPublicPage({ mode, title, description, showInternalBadge }: Props) {
  const [links, setLinks] = useState<TrialLink[] | null>(null);

  useEffect(() => {
    let alive = true;
    trialLinkService.list().then((all: TrialLink[]) => {
      if (!alive) return;
      setLinks(all.filter((l: TrialLink) => l.mode === mode));
    }).catch(() => alive && setLinks([]));
    return () => {
      alive = false;
    };
  }, [mode]);

  const android = links?.find((l) => l.platform === "android");
  const ios = links?.find((l) => l.platform === "ios");

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          {showInternalBadge && (
            <Badge variant="destructive" className="uppercase tracking-wide">
              Internal Trial
            </Badge>
          )}
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <TrialQRCard platform="android" link={android} />
        <TrialQRCard platform="ios" link={ios} />
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        Scan the QR code or use the link buttons to install the latest{" "}
        {mode} trial build.
      </p>
    </main>
  );
}