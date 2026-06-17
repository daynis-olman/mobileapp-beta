import { createFileRoute } from "@tanstack/react-router";
import { TrialPublicPage } from "@/components/trial/TrialPublicPage";

export const Route = createFileRoute("/trial_/internal")({
  component: InternalTrial,
});

function InternalTrial() {
  return (
    <TrialPublicPage
      mode="internal"
      title="Internal Trial"
      description="For internal QA, engineers, and stakeholders. Please do not share these links outside the organisation."
      showInternalBadge
    />
  );
}
