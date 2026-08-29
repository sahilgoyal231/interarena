"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

export const FormattedText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  if (!text) return null;
  
  // Defensive type check to prevent [object Object] rendering or crashes
  const safeText = typeof text === 'string' ? text : JSON.stringify(text);

  // Replace literal '\n' and '/n' with actual newline characters
  let cleanedText = safeText.replace(/\\n/g, "\n").replace(/\/n/g, "\n");

  // Render LaTeX math enclosed in $...$
  cleanedText = cleanedText.replace(/\$([^\$]+)\$/g, (match, math) => {
    try {
      return katex.renderToString(math, { throwOnError: false, displayMode: false });
    } catch (e) {
      return match;
    }
  });

  // Split by Example blocks
  const segments = cleanedText.split(
    /(\*\*Example \d+:\*\*[\s\S]*?(?=\n\n\*\*|$))/g,
  );


  return (
    <div className={`text-zinc-200 leading-relaxed ${className || ""}`}>
      {segments.map((segment, idx) => {
        if (!segment.trim()) return null;

        if (segment.startsWith("**Example")) {
          const lines = segment.trim().split("\n");
          const header = lines[0].replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="text-white font-bold text-base">$1</strong>',
          );
          const content = lines
            .slice(1)
            .join("\n")
            .trim()
            .replace(/Input:/g, '<strong class="text-zinc-100">Input:</strong>')
            .replace(
              /Output:/g,
              '<strong class="text-zinc-100">Output:</strong>',
            )
            .replace(
              /Explanation:/g,
              '<strong class="text-zinc-100">Explanation:</strong>',
            )
            .replace(
              /`(.*?)`/g,
              '<code class="bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>',
            );

          return (
            <div key={idx} className="mb-4">
              <div
                dangerouslySetInnerHTML={{ __html: header }}
                className="mb-3"
              />
              <div
                className="pl-4 border-l-2 border-zinc-700 font-mono text-sm overflow-x-auto whitespace-pre-wrap text-zinc-300"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          );
        }

        const isTable =
          (segment.match(/\|/g) || []).length >= 2 && segment.includes("\n");

        // Format main text (Titles, Bold, Inline Code, Lists)
        let cleanSegment = segment.trim();

        if (cleanSegment.includes("**Constraints:**")) {
          const [mainText, constraintsText] =
            cleanSegment.split("**Constraints:**");

          const formattedMain = mainText
            .replace(
              /^# (.*?)\n+/g,
              '<div class="mb-5"><strong class="text-2xl font-bold text-white tracking-tight">$1</strong></div>',
            )
            .replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="text-white font-bold">$1</strong>',
            )
            .replace(
              /`(.*?)`/g,
              '<code class="bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono">$1</code>',
            )
            .replace(/\n\n/g, '<div class="mb-5"></div>');

          const formattedConstraints = constraintsText
            .replace(
              /^- (.*)$/gm,
              '<li class="relative pl-5"><span class="absolute left-0 top-[0.45rem] w-1.5 h-1.5 rounded-full bg-zinc-500 shadow-sm"></span><span class="text-zinc-300 leading-relaxed">$1</span></li>',
            )
            .replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="text-white font-bold">$1</strong>',
            )
            .replace(
              /`(.*?)`/g,
              '<code class="bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono">$1</code>',
            )
            .replace(/\n/g, "");

          cleanSegment =
            formattedMain +
            '<div class="mb-4 mt-2 font-bold text-white text-lg">Constraints:</div><ul class="flex flex-col gap-3">' +
            formattedConstraints +
            "</ul>";
        } else {
          cleanSegment = cleanSegment
            .replace(
              /^# (.*?)\n+/g,
              '<div class="mb-5"><strong class="text-2xl font-bold text-white tracking-tight">$1</strong></div>',
            )
            .replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="text-white font-bold">$1</strong>',
            )
            .replace(
              /`(.*?)`/g,
              '<code class="bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded-md text-[13px] font-mono">$1</code>',
            )
            .replace(/\n\n/g, '<div class="mb-5"></div>');
        }

        return (
          <div
            key={idx}
            className={`whitespace-pre-wrap mb-4 ${isTable ? "font-mono text-sm block overflow-x-auto bg-zinc-900 p-3 rounded-lg border border-zinc-800 leading-relaxed text-zinc-300" : ""}`}
            dangerouslySetInnerHTML={{ __html: cleanSegment }}
          />
        );
      })}
    </div>
  );
};
