"use client";

import { use } from "react";
import { AssessmentRunner } from "@/components/assessment/AssessmentRunner";

export default function ActiveAptitudeSession({
  params,
}: {
  params: Promise<{ subTopic: string }>;
}) {
  const resolvedParams = use(params);
  const subTopic = decodeURIComponent(resolvedParams.subTopic);

  return (
    <AssessmentRunner
      moduleName="Aptitude"
      subTopic={subTopic}
      apiType="APTITUDE"
      backPath="/aptitude"
    />
  );
}
