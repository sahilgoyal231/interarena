export function cleanText(text: string): string {
  if (!text) return text;

  let cleaned = text.trim();

  // 0. Remove unnecessary prefixes (e.g. "Q:", "Question 1:", "Problem:", "1.")
  cleaned = cleaned.replace(/^(question|problem|q|example)\s*\d*\s*[:.-]\s*/i, '');
  cleaned = cleaned.replace(/^\d+[\.\)]\s*/, '');

  // 1. Fix mojibake
  const mojibakeMap: Record<string, string> = {
    '\u00e3 \u2014': '×',
    '\u00e2 \u02c6 \u2019': '-',
    '\u00e2 \u20ac \u201c': '-',
    '\u00e2 \u20ac \u201d': '-',
    '\u00e2 \u20ac \u02dc': "'",
    '\u2018': "'",
    '\u2019': "'",
    'â€˜': "'",
    'â€™': "'",
    'â€œ': '"',
    'â€\u009d': '"',
    'â€“': '-',
    'â€”': '-',
    'âˆ’': '-',
    'Ã—': '×'
  };

  for (const [bad, good] of Object.entries(mojibakeMap)) {
    cleaned = cleaned.split(bad).join(good);
  }

  // 2. Fix spaces around punctuation
  cleaned = cleaned.replace(/\s+([.,?!:;])/g, '$1');
  cleaned = cleaned.replace(/([.,?!:;])(?=[A-Za-z0-9])/g, '$1 '); // ensure space after punctuation
  cleaned = cleaned.replace(/\s+'\s+s\b/g, "'s"); // fix "banker ' s"
  cleaned = cleaned.replace(/\s+'\s+/g, "'"); // general apostrophe spacing
  cleaned = cleaned.replace(/\s+"/g, ' "');
  cleaned = cleaned.replace(/"\s+/g, '" ');
  cleaned = cleaned.replace(/\s*\(\s*/g, ' (');
  cleaned = cleaned.replace(/\s*\)\s*/g, ') ');
  cleaned = cleaned.replace(/\(\s+/g, '(');
  cleaned = cleaned.replace(/\s+\)/g, ')');

  // Remove multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  // 3. Capitalization (Title case first word of sentences)
  cleaned = cleaned.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });

  // 4. Missing Question Mark
  if (cleaned.length > 0 && !/[.!?]"?$/.test(cleaned)) {
    const lower = cleaned.toLowerCase();
    const isQuestion = /^(what|how|why|when|where|which|who|find|calculate|determine|solve)\b/i.test(lower) || lower.includes('how many') || lower.includes('how much');
    
    if (isQuestion) {
      cleaned += '?';
    } else {
      cleaned += '.';
    }
  }

  // 5. Basic Table Formatting
  if (cleaned.includes('\n')) {
    const lines = cleaned.split('\n');
    let inTable = false;
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const columns = line.split(/\s{2,}|\t/).filter(c => c.trim().length > 0);
      
      if (columns.length >= 2) {
        if (!inTable) {
          inTable = true;
          newLines.push(`| ${columns.map((_, idx) => `Col ${idx + 1}`).join(' | ')} |`);
          newLines.push(`| ${columns.map(() => '---').join(' | ')} |`);
        }
        newLines.push(`| ${columns.join(' | ')} |`);
      } else {
        inTable = false;
        newLines.push(line);
      }
    }
    cleaned = newLines.join('\n');
  }

  return cleaned.trim();
}

export function cleanOptions(options: unknown): unknown {
  if (!options) return options;

  let optsArray: unknown[] = [];

  if (typeof options === 'string') {
    // Split by comma followed by option letter like ", b )"
    const parts = options.split(/,\s*(?=[a-e]\s*[\.\)])/i);
    optsArray = parts;
  } else if (Array.isArray(options)) {
    optsArray = options;
  } else if (typeof options === 'object') {
    const cleanedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(options as Record<string, unknown>)) {
      if (typeof val === 'string') {
        let p = val.trim();
        p = p.replace(/[.?\s]+$/, '');
        cleanedObj[key] = p;
      } else {
        cleanedObj[key] = val;
      }
    }
    return cleanedObj;
  }

  // 1. First pass: strip the A) B) prefixes and clean up
  const cleanedValues: unknown[] = [];
  for (const opt of optsArray) {
    if (typeof opt === 'string') {
      let p = opt.trim();
      p = p.replace(/[.?\s]+$/, '');
      const match = p.match(/^([a-eA-E])\s*[\.\)]\s*(.*)/);
      const value = match ? match[2].trim() : p;
      
      // Filter out irrelevant options (empty or just punctuation)
      if (value.replace(/[^\w\d]/g, '').length === 0) {
         continue; 
      }
      cleanedValues.push(value);
    } else {
      cleanedValues.push(opt);
    }
  }

  // 2. Remove duplicates (case-insensitive for strings)
  const seen = new Set<string>();
  const uniqueValues: unknown[] = [];
  for (const val of cleanedValues) {
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueValues.push(val);
      }
    } else {
      uniqueValues.push(val);
    }
  }

  // 3. Re-apply A, B, C markings in order
  return uniqueValues.map((opt, index) => {
    if (typeof opt === 'string') {
      const letter = String.fromCharCode(65 + index); // 65 is 'A'
      return `${letter}) ${opt}`;
    }
    return opt;
  });
}

export function processQuestionData(data: Record<string, unknown> | null | undefined) {
  if (!data) return data;
  
  const cleanedData = { ...data };
  
  if (typeof cleanedData.prompt === 'string') {
    cleanedData.prompt = cleanText(cleanedData.prompt);
  }
  
  if (typeof cleanedData.explanation === 'string') {
    cleanedData.explanation = cleanText(cleanedData.explanation);
  }
  
  if (cleanedData.options !== undefined) {
    cleanedData.options = cleanOptions(cleanedData.options);
  }

  return cleanedData;
}
