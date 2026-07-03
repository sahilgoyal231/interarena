export const FormattedText = ({ text, className }: { text: string; className?: string }) => {
  if (!text) return null;
  // Replace literal '\n' and '/n' with actual newline characters
  const cleanedText = text.replace(/\\n/g, '\n').replace(/\/n/g, '\n');
  
  // Detect ASCII tables (heuristically by checking for pipes and newlines)
  const isTable = (cleanedText.match(/\|/g) || []).length >= 2 && cleanedText.includes('\n');
  
  return (
    <span className={`whitespace-pre-wrap ${isTable ? 'font-mono text-sm block overflow-x-auto bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 my-3 leading-relaxed text-zinc-300' : ''} ${className || ''}`}>
      {cleanedText}
    </span>
  );
};
