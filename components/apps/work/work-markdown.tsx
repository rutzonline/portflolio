"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { Element, ElementContent } from "hast";
import { cn } from "@/lib/utils";
import { IOS_MOBILE_READING_TEXT_CLASS } from "@/lib/ui-tokens";

function paragraphHasBlockChild(node: { children?: ElementContent[] } | undefined): boolean {
  if (!node?.children?.length) return false;
  return node.children.some(
    (child) =>
      child.type === "element" &&
      ["img", "figure", "div", "blockquote", "ul", "ol", "pre", "hr", "table"].includes(
        (child as Element).tagName
      )
  );
}

function isArrowLead(text: string): boolean {
  return text.trimStart().startsWith("→");
}

function createWorkMarkdownComponents(isMobileView = false): Components {
  const bodyClass = cn(
    "m-0 mb-4 last:mb-0 text-zinc-300",
    isMobileView ? IOS_MOBILE_READING_TEXT_CLASS : "text-[14px] leading-[1.7]"
  );
  const listClass = cn(
    "m-0 mb-5 space-y-2 pl-5 text-zinc-300 last:mb-0",
    isMobileView ? IOS_MOBILE_READING_TEXT_CLASS : "text-[14px] leading-[1.65]"
  );

  return {
    p: ({ node, children }) => {
      if (paragraphHasBlockChild(node)) {
        return <div className={bodyClass}>{children}</div>;
      }

      const isBoldOnly =
        node?.children?.length === 1 &&
        node.children[0].type === "element" &&
        (node.children[0] as Element).tagName === "strong";

      if (isBoldOnly) {
        return (
          <p className="m-0 mb-2 mt-6 text-[13px] font-semibold text-zinc-200 first:mt-0">
            {children}
          </p>
        );
      }

      const text =
        node?.children
          ?.map((child) => ("value" in child ? String(child.value) : ""))
          .join("") ?? "";

      if (isArrowLead(text)) {
        return (
          <p className="m-0 mb-5 rounded-lg border border-white/8 bg-zinc-800/40 px-3.5 py-3 text-[13px] leading-[1.65] text-zinc-300 last:mb-0">
            {children}
          </p>
        );
      }

      return <p className={bodyClass}>{children}</p>;
    },
    hr: () => <hr className="my-6 border-0 border-t border-white/10" />,
    ul: ({ children }) => (
      <ul className={cn(listClass, "list-disc")}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={cn(listClass, "list-decimal")}>{children}</ol>
    ),
    li: ({ children }) => <li className="pl-0.5 marker:text-zinc-500">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="m-0 mb-6 rounded-lg border border-accent-blue/20 bg-accent-blue/8 px-4 py-3.5 text-[13px] leading-[1.65] text-zinc-200 last:mb-0 [&_p]:mb-2 [&_p:last-child]:mb-0">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-100">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
    h2: ({ children }) => (
      <h2 className="m-0 mb-3 mt-8 text-base font-semibold text-zinc-100 first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3
        className={cn(
          "m-0 mb-3 mt-8 border-t border-white/10 pt-6",
          "text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500",
          "first:mt-0 first:border-t-0 first:pt-0"
        )}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="m-0 mb-2 mt-5 text-[13px] font-semibold text-zinc-200">{children}</h4>
    ),
  };
}

interface WorkMarkdownProps {
  markdown: string;
  className?: string;
  isMobileView?: boolean;
}

/** Rich markdown for work stint / case study bodies — preserves casing vs site-wide lowercase preview. */
export function WorkMarkdown({ markdown, className, isMobileView = false }: WorkMarkdownProps) {
  if (!markdown.trim()) return null;

  return (
    <article className={cn("work-markdown max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={createWorkMarkdownComponents(isMobileView)}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
