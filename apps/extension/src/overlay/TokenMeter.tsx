import type { Language, TokenPrediction } from "@gnomon/core";
import { t } from "@gnomon/shared";

export interface TokenMeterProps {
  token: TokenPrediction;
  language: Language;
}

export function TokenMeter({ token, language }: TokenMeterProps) {
  return (
    <div className="gnomon-grid">
      <div className="gnomon-metric">
        <div className="gnomon-label">{t(language, "inputTokens")}</div>
        <div className="gnomon-value">{token.inputTokens}</div>
      </div>
      <div className="gnomon-metric">
        <div className="gnomon-label">{t(language, "predictedOutput")}</div>
        <div className="gnomon-value">
          {token.outputTokensMin}-{token.outputTokensMax}
        </div>
      </div>
      <div className="gnomon-metric">
        <div className="gnomon-label">{t(language, "estimatedTotal")}</div>
        <div className="gnomon-value">
          {token.totalTokensMin}-{token.totalTokensMax}
        </div>
      </div>
      <div className="gnomon-metric">
        <div className="gnomon-label">{t(language, "confidence")}</div>
        <div className="gnomon-value">{token.confidence}</div>
      </div>
    </div>
  );
}
