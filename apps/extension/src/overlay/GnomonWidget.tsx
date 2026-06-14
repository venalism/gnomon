import { useMemo, useState } from "react";

import type { Language, OptimizationMode, OptimizedPrompt, PromptAnalysisResult } from "@gnomon/core";
import { optimizePrompt } from "@gnomon/core";
import { t } from "@gnomon/shared";

import { ScoreBadge } from "./ScoreBadge";
import { SuggestionPanel } from "./SuggestionPanel";
import { TokenMeter } from "./TokenMeter";

export interface GnomonWidgetProps {
  analysis: PromptAnalysisResult | null;
  language: Language;
  optimizationMode: OptimizationMode;
  tokenBudget: number;
  onApply: (prompt: string) => void;
}

export function GnomonWidget({
  analysis,
  language,
  optimizationMode,
  tokenBudget,
  onApply
}: GnomonWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [optimized, setOptimized] = useState<OptimizedPrompt | null>(null);
  const [copied, setCopied] = useState(false);

  const overBudget = Boolean(analysis && analysis.token.totalTokensMax > tokenBudget);
  const compactText = useMemo(() => {
    if (!analysis) {
      return t(language, "noPrompt");
    }

    return `${analysis.token.inputTokens} input · ${analysis.token.outputTokensMin}-${analysis.token.outputTokensMax} output`;
  }, [analysis, language]);

  const handleOptimize = () => {
    if (!analysis) {
      return;
    }

    setOptimized(optimizePrompt(analysis.prompt, optimizationMode));
    setExpanded(true);
  };

  const handleCopy = async () => {
    if (!optimized) {
      return;
    }

    await navigator.clipboard?.writeText(optimized.optimized);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const cardClassName = expanded ? "gnomon-card gnomon-card-expanded" : "gnomon-card";

  return (
    <div className={cardClassName} role="region" aria-label="Gnomon prompt analysis">
      <div className="gnomon-header">
        <div className="gnomon-brand">
          <span className="gnomon-mark">G</span>
          <span>Gnomon</span>
        </div>
        <button
          className="gnomon-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="gnomon-content">
        {analysis ? (
          <>
            <div className="gnomon-compact">
              <ScoreBadge score={analysis.score} language={language} />
              <span className="gnomon-pill">{compactText}</span>
              {overBudget ? <span className="gnomon-pill bad">Over {tokenBudget} budget</span> : null}
            </div>

            {expanded ? (
              <>
                <div className="gnomon-section">
                  <TokenMeter token={analysis.token} language={language} />
                </div>
                <SuggestionPanel issues={analysis.issues} suggestions={analysis.suggestions} language={language} />
                {optimized ? (
                  <div className="gnomon-section">
                    <strong>
                      {t(language, "saved")}: {optimized.savedTokens} tokens ({optimized.savedPercentage}%)
                    </strong>
                    <div className="gnomon-compare" style={{ marginTop: 8 }}>
                      <div>
                        <div className="gnomon-label">{t(language, "original")}</div>
                        <div className="gnomon-textbox">{optimized.original}</div>
                      </div>
                      <div>
                        <div className="gnomon-label">{t(language, "optimized")}</div>
                        <div className="gnomon-textbox">{optimized.optimized}</div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <div className="gnomon-empty">{compactText}</div>
        )}
      </div>

      {analysis ? (
        <>
          <div className="gnomon-actions">
            <button className="gnomon-button" type="button" onClick={handleOptimize}>
              {t(language, "optimizePrompt")}
            </button>
            {optimized ? (
              <>
                <button
                  className="gnomon-button secondary"
                  type="button"
                  onClick={() => onApply(optimized.optimized)}
                >
                  {t(language, "applyOptimizedPrompt")}
                </button>
                <button className="gnomon-button secondary" type="button" onClick={handleCopy}>
                  {copied ? t(language, "copied") : t(language, "copy")}
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
