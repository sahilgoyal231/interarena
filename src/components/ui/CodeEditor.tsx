"use client";

import React from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  height = "100%",
  readOnly = false,
}) => {
  const monaco = useMonaco();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Delay mounting the editor slightly to bypass React Strict Mode's rapid double-mount.
    // This permanently prevents Monaco's "Duplicate definition" and "cancelation" race conditions!
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (monaco) {
      // We can define a custom theme matching our zinc-950 aesthetic here
      monaco.editor.defineTheme("interarena-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#09090b", // zinc-950
          "editor.lineHighlightBackground": "#18181b", // zinc-900
          "editorLineNumber.foreground": "#52525b", // zinc-500
          "editorIndentGuide.background": "#27272a", // zinc-800
        },
      });
      monaco.editor.setTheme("interarena-dark");
    }
  }, [monaco]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
        Loading editor engine...
      </div>
    );
  }

  return (
    <Editor
      height={height}
      language={language === "cpp" ? "cpp" : language === "java" ? "java" : language === "python" ? "python" : "javascript"}
      value={value}
      theme="interarena-dark"
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        readOnly: readOnly,
        domReadOnly: readOnly,
        renderLineHighlight: readOnly ? "none" : "all",
        contextmenu: !readOnly,
        selectionHighlight: !readOnly,
        occurrencesHighlight: readOnly ? "off" : "singleFile",
        cursorBlinking: readOnly ? "solid" : "smooth",
        cursorStyle: readOnly ? "line-thin" : "line",
        fontSize: 14,
        fontFamily: "var(--font-mono), monospace",
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        formatOnPaste: true,
        renderValidationDecorations: "off",
      }}
      loading={
        <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
          Loading editor engine...
        </div>
      }
    />
  );
};
