import { getInputSelectors } from "./supported-sites";

export type PromptInputElement = HTMLTextAreaElement | HTMLElement;

export interface PromptSnapshot {
  input: PromptInputElement;
  text: string;
}

export interface PromptObserver {
  disconnect: () => void;
  getCurrentInput: () => PromptInputElement | null;
  setCurrentPrompt: (text: string) => void;
}

function debounce<T extends (...args: never[]) => void>(callback: T, delayMs: number): T {
  let timeoutId: number | undefined;

  return ((...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => callback(...args), delayMs);
  }) as T;
}

function isVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function isPromptCandidate(element: Element): element is PromptInputElement {
  if (!isVisible(element)) {
    return false;
  }

  if (element instanceof HTMLTextAreaElement) {
    return !element.disabled && !element.readOnly;
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return true;
  }

  return element instanceof HTMLElement && element.getAttribute("role") === "textbox";
}

export function extractPromptText(input: PromptInputElement): string {
  if (input instanceof HTMLTextAreaElement) {
    return input.value;
  }

  return input.innerText || input.textContent || "";
}

export function setPromptText(input: PromptInputElement, text: string): void {
  input.focus();

  if (input instanceof HTMLTextAreaElement) {
    input.value = text;
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  input.textContent = text;
  input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
}

export function findPromptInput(): PromptInputElement | null {
  const selectors = getInputSelectors(window.location.hostname);

  for (const selector of selectors) {
    const candidates = Array.from(document.querySelectorAll(selector)).filter(isPromptCandidate);
    const candidate = candidates.at(-1);

    if (candidate) {
      return candidate;
    }
  }

  return null;
}

export function observePromptInput(
  onPromptChange: (snapshot: PromptSnapshot) => void,
  debounceMs = 300,
): PromptObserver {
  let currentInput: PromptInputElement | null = null;
  let cleanupInput: (() => void) | null = null;

  const emitChange = debounce(() => {
    if (!currentInput) {
      return;
    }

    onPromptChange({
      input: currentInput,
      text: extractPromptText(currentInput)
    });
  }, debounceMs);

  const attachInput = () => {
    const nextInput = findPromptInput();

    if (!nextInput || nextInput === currentInput) {
      return;
    }

    cleanupInput?.();
    currentInput = nextInput;
    currentInput.addEventListener("input", emitChange);
    currentInput.addEventListener("keyup", emitChange);
    cleanupInput = () => {
      currentInput?.removeEventListener("input", emitChange);
      currentInput?.removeEventListener("keyup", emitChange);
    };
    emitChange();
  };

  const mutationObserver = new MutationObserver(() => attachInput());
  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  attachInput();

  return {
    disconnect: () => {
      cleanupInput?.();
      mutationObserver.disconnect();
    },
    getCurrentInput: () => currentInput,
    setCurrentPrompt: (text: string) => {
      if (currentInput) {
        setPromptText(currentInput, text);
        emitChange();
      }
    }
  };
}
