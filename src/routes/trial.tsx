import { createFileRoute } from "@tanstack/react-router";
import { TrialPublicPage } from "@/components/trial/TrialPublicPage";

export const Route = createFileRoute("/trial")({
  component: ExternalTrial,
});

function ExternalTrial() {
  return (
    <TrialPublicPage
      mode="external"
      title="External Trial"
      description="Thanks for helping us test! Scan a QR code or tap a button below to install the latest trial build."
    />
  );
}
