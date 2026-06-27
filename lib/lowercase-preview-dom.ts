import {
  LOWERCASE_PRESERVE_CLASS,
  wordHasAdjacentCapitals,
} from "@/lib/lowercase-preview";

const WORD_PATTERN = /[A-Za-z0-9']+/g;

const SKIP_ANCESTOR_SELECTOR = [
  "script",
  "style",
  "noscript",
  "svg",
  "input",
  "textarea",
  "select",
  "option",
  '[contenteditable="true"]',
  `.${LOWERCASE_PRESERVE_CLASS}`,
].join(",");

function shouldSkipNode(node: Node): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest(SKIP_ANCESTOR_SELECTOR));
}

function processTextNode(node: Text): void {
  if (shouldSkipNode(node)) return;

  const text = node.textContent ?? "";
  if (!text || !/[A-Z]/.test(text)) return;

  WORD_PATTERN.lastIndex = 0;
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = WORD_PATTERN.exec(text)) !== null) {
    const word = match[0];
    const start = match.index;

    if (start > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
    }

    if (wordHasAdjacentCapitals(word)) {
      const span = document.createElement("span");
      span.className = LOWERCASE_PRESERVE_CLASS;
      span.textContent = word;
      fragment.appendChild(span);
    } else {
      fragment.appendChild(document.createTextNode(word));
    }

    lastIndex = start + word.length;
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  if (fragment.childNodes.length <= 1 && fragment.firstChild?.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  node.replaceWith(fragment);
}

function processRoot(root: ParentNode): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      textNodes.push(current as Text);
    }
    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    processTextNode(textNode);
  }
}

export function applyLowercasePreviewPreservation(root: ParentNode = document.body): void {
  processRoot(root);
}

export function observeLowercasePreviewPreservation(root: ParentNode = document.body): () => void {
  let frame = 0;

  const schedule = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      applyLowercasePreviewPreservation(root);
    });
  };

  schedule();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData" || mutation.addedNodes.length > 0) {
        schedule();
        return;
      }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
  };
}
