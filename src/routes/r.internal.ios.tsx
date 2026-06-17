import { createFileRoute } from "@tanstack/react-router";
import { RedirectResolver } from "@/components/trial/RedirectResolver";

export const Route = createFileRoute("/r/internal/ios")({
  component: () => <RedirectResolver mode="internal" platform="ios" />,
});
