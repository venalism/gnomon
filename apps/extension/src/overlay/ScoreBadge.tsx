import type { PromptScore } from "@gnomon/core";
import { scoreLabel, type messages } from "@gnomon/shared";

type Language = keyof typeof messages;

function toneClass(score: number): string {
  if (score <= 40) {
    return "bad";
  }

  if (score <= 70) {
    return "warn";
  }

  return "good";
}

export interface ScoreBadgeProps {
  score: PromptScore;
  language: Language;
}

export function ScoreBadge({ score, language }: ScoreBadgeProps) {
  return (
    <span className={`gnomon-pill ${toneClass(score.overall)}`}>
      Score {score.overall} · {scoreLabel(language, score.label)}
    </span>
  );
}
