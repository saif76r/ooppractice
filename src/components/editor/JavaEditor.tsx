import React, { useRef, useEffect } from 'react';

interface JavaEditorProps {
  code: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
  onRunShortcut?: () => void;
}

export const JavaEditor: React.FC<JavaEditorProps> = ({
  code,
  onChange,
  readOnly = false,
  onRunShortcut,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key indentation (4 spaces)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunShortcut?.();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const spaces = '    ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#080b14]/55 backdrop-blur-md border border-slate-800/80 rounded-lg overflow-hidden flex font-mono text-xs md:text-sm shadow-inner">
      {/* Line Numbers Gutter */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="min-w-[3.25rem] py-3 bg-[#05070d]/45 text-slate-500 select-none text-right pr-3 overflow-hidden border-r border-slate-800/70 leading-6 font-mono text-xs shrink-0"
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="h-6">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor Textarea */}
      <div className="relative flex-1 h-full">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          className="w-full h-full p-3 bg-transparent text-slate-100 placeholder-slate-600 resize-none outline-none leading-6 font-mono whitespace-pre overflow-auto selection:bg-indigo-900 selection:text-white"
          placeholder="// Write your Java OOP code here..."
        />
      </div>
    </div>
  );
};
