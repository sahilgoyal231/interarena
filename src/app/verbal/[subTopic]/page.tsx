"use client";

import { use } from "react";
import { AssessmentRunner } from "@/components/assessment/AssessmentRunner";

export default function ActiveVerbalSession({
  params,
}: {
  params: Promise<{ subTopic: string }>;
}) {
  const resolvedParams = use(params);
  const subTopic = decodeURIComponent(resolvedParams.subTopic);

  return (
    <AssessmentRunner
      moduleName="Verbal Ability"
      subTopic={subTopic}
      apiType="VERBAL"
      backPath="/verbal"
    />
  );
}
