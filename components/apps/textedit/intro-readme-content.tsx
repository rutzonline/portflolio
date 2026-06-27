import type { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { Element, ElementContent } from "hast";
import { resolveIntroReadmeAppLink } from "@/lib/intro-readme-app-links";

const RULE_LINE = /^(?:-{3,}|─{3,}|═{3,})$/;
const LEADING_IMAGE = /^!\[([^\]]*)\]\(([^)]+)\)\s*\n\n/;

function normalizeReadmeMarkdown(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, "\n\n")
    .replace(/<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi, "![photo]($1)")
    .split("\n")
    .map((line) => (RULE_LINE.test(line.trim()) ? "---" : line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

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

function isBannerImage(src: string): boolean {
  return /readme(?:-cover)?\.png|banner/i.test(src);
}

function ReadmeBanner({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="mb-5 flex justify-center">
      <div className="overflow-hidden rounded-lg border border-black/10 bg-zinc-100 dark:border-white/8 dark:bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          className="block h-auto w-auto max-h-[360px] max-w-[min(100%,300px)] object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}

function ReadmePhoto({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="flex shrink-0 items-stretch gap-2">
      <span className="w-px shrink-0 self-stretch bg-black/10 dark:bg-white/12" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="block h-[148px] w-[124px] max-w-[36vw] rounded-lg object-cover object-top"
      />
      <span className="w-px shrink-0 self-stretch bg-black/10 dark:bg-white/12" aria-hidden />
    </div>
  );
}

function splitLeadingImage(markdown: string): {
  alt: string;
  src: string;
  body: string;
} | null {
  const normalized = normalizeReadmeMarkdown(markdown);
  const match = normalized.match(LEADING_IMAGE);
  if (!match) return null;

  return {
    alt: match[1],
    src: match[2],
    body: normalized.slice(match[0].length).trim(),
  };
}

function splitHeroAsideText(
  heroText: string,
  maxAsideBlocks = 2
): { aside: string; overflow: string } {
  const blocks = heroText.split(/\n\n+/).filter(Boolean);
  return {
    aside: blocks.slice(0, maxAsideBlocks).join("\n\n"),
    overflow: blocks.slice(maxAsideBlocks).join("\n\n"),
  };
}

function extractPlainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractPlainText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractPlainText((node as ReactElement).props.children);
  }
  return "";
}

interface MarkdownComponentOptions {
  linkAppNames?: boolean;
  onOpenApp?: (appId: string) => void;
  onOpenTrash?: () => void;
}

function createMarkdownComponents(options: MarkdownComponentOptions = {}): Components {
  const bodyClass = "m-0 mb-4 last:mb-0 leading-[1.65] text-zinc-700 dark:text-zinc-300";
  const { linkAppNames, onOpenApp, onOpenTrash } = options;

  return {
    p: ({ node, children }) => {
      if (paragraphHasBlockChild(node)) {
        return <div className={bodyClass}>{children}</div>;
      }
      return <p className={bodyClass}>{children}</p>;
    },
    hr: () => <hr className="my-4 border-0 border-t border-black/10 dark:border-white/10" />,
    ul: ({ children }) => (
      <ul className="m-0 mb-4 list-disc space-y-1.5 pl-5 leading-[1.6] text-zinc-700 dark:text-zinc-300 last:mb-0">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="m-0 mb-4 list-decimal space-y-1.5 pl-5 leading-[1.6] text-zinc-700 dark:text-zinc-300 last:mb-0">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-0.5">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="m-0 mb-4 border-l-2 border-black/15 pl-3.5 text-zinc-600 italic leading-[1.6] last:mb-0 dark:border-white/15 dark:text-zinc-400">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => {
      if (!linkAppNames) {
        return <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>;
      }

      const label = extractPlainText(children);
      const target = resolveIntroReadmeAppLink(label);
      if (!target || (!onOpenApp && target !== "trash")) {
        return <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>;
      }

      return (
        <button
          type="button"
          onClick={() => {
            if (target === "trash") {
              onOpenTrash?.();
              return;
            }
            onOpenApp?.(target);
          }}
          className="font-semibold text-zinc-900 underline decoration-black/20 underline-offset-2 can-hover:hover:decoration-black/40 cursor-pointer bg-transparent border-0 p-0 inline text-inherit align-baseline dark:text-zinc-100 dark:decoration-white/25 dark:can-hover:hover:decoration-white/60"
        >
          {children}
        </button>
      );
    },
    em: ({ children }) => <em className="italic text-zinc-800 dark:text-zinc-200">{children}</em>,
    h1: ({ children }) => (
      <p className="m-0 mb-4 text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{children}</p>
    ),
    h2: ({ children }) => (
      <p className="m-0 mb-3 mt-1 text-[14px] font-semibold leading-snug text-zinc-900 dark:text-zinc-100">{children}</p>
    ),
    h3: ({ children }) => (
      <p className="m-0 mb-2.5 mt-1 text-[14px] font-medium leading-snug text-zinc-800 dark:text-zinc-200">{children}</p>
    ),
    img: ({ src, alt }) =>
      isBannerImage(src ?? "") ? (
        <ReadmeBanner src={src ?? ""} alt={alt} />
      ) : (
        <ReadmePhoto src={src ?? ""} alt={alt} />
      ),
    code: ({ className, children }) => {
      if (className) {
        return (
          <pre className="mb-4 overflow-auto rounded-md bg-black/5 p-3 text-[13px] leading-relaxed last:mb-0 dark:bg-black/30">
            <code>{children}</code>
          </pre>
        );
      }
      return (
        <code className="rounded bg-black/8 px-1 py-0.5 text-[13px] text-zinc-800 dark:bg-white/8 dark:text-zinc-200">{children}</code>
      );
    },
  };
}

function MarkdownBody({
  markdown,
  components,
}: {
  markdown: string;
  components: Components;
}) {
  if (!markdown.trim()) return null;
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}

interface IntroReadmeContentProps {
  text: string;
  linkAppNames?: boolean;
  onOpenApp?: (appId: string) => void;
  onOpenTrash?: () => void;
}

/** Renders readme tab text as Markdown with relaxed spacing. */
export function IntroReadmeContent({
  text,
  linkAppNames = false,
  onOpenApp,
  onOpenTrash,
}: IntroReadmeContentProps) {
  const leading = splitLeadingImage(text);
  const components = createMarkdownComponents({ linkAppNames, onOpenApp, onOpenTrash });

  if (leading) {
    if (isBannerImage(leading.src)) {
      return (
        <div className="readme-markdown text-[14px] text-zinc-700 dark:text-zinc-300">
          <ReadmeBanner src={leading.src} alt={leading.alt} />
          <MarkdownBody markdown={leading.body} components={components} />
        </div>
      );
    }

    const { aside, overflow } = splitHeroAsideText(leading.body);
    const bodyMarkdown = overflow;

    return (
      <div className="readme-markdown text-[14px] text-zinc-700 dark:text-zinc-300">
        <div className="mb-4 flex items-stretch gap-4">
          <ReadmePhoto src={leading.src} alt={leading.alt} />
          <div className="flex min-w-0 flex-1 flex-col justify-end [&_p:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {aside}
            </ReactMarkdown>
          </div>
        </div>
        {bodyMarkdown.trim() ? (
          <div className="mt-5">
            <MarkdownBody markdown={bodyMarkdown} components={components} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="readme-markdown text-[14px] text-zinc-700 dark:text-zinc-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {normalizeReadmeMarkdown(text)}
      </ReactMarkdown>
    </div>
  );
}
