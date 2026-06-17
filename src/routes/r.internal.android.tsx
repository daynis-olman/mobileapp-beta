import { createFileRoute } from "@tanstack/react-router";
import { RedirectResolver } from "@/components/trial/RedirectResolver";

export const Route = createFileRoute("/r/internal/android")({
  component: () => <RedirectResolver mode="internal" platform="android" />,
});
