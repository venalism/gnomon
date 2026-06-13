import type { Language, PromptIssue, PromptSuggestion } from "@gnomon/core";
import { severityLabel, t } from "@gnomon/shared";

export interface SuggestionPanelProps {
  issues: PromptIssue[];
  suggestions: PromptSuggestion[];
  language: Language;
}

export function SuggestionPanel({ issues, suggestions, language }: SuggestionPanelProps) {
  return (
    <>
      {issues.length > 0 ? (
        <div className="gnomon-section">
          <strong>{t(language, "issues")}</strong>
          <ul className="gnomon-list">
            {issues.slice(0, 4).map((issue) => (
              <li key={issue.id}>
                <strong>
                  {severityLabel(language, issue.severity)} · {issue.message}
                </strong>
                {issue.evidence ? <span>{issue.evidence}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {suggestions.length > 0 ? (
        <div className="gnomon-section">
          <strong>{t(language, "suggestions")}</strong>
          <ul className="gnomon-list">
            {suggestions.slice(0, 4).map((suggestion) => (
              <li key={suggestion.id}>
                <strong>{suggestion.title}</strong>
                <span>{suggestion.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
