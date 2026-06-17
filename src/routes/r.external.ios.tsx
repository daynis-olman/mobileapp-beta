import { createFileRoute } from "@tanstack/react-router";
import { RedirectResolver } from "@/components/trial/RedirectResolver";

export const Route = createFileRoute("/r/external/ios")({
  component: () => <RedirectResolver mode="external" platform="ios" />,
});
