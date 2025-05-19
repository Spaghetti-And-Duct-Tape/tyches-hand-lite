import { useRef, useState } from "react";

interface useDialogueReturn {
  index: number;
  currentLine: string;
  isDone: boolean;
  advance: () => void;
  reset: () => void;
}

export default function useDialogue(
  lines: string[] = [], 
  onComplete?: () => void
): useDialogueReturn {
  const lastIndex: number = lines.length - 1;
  const [index, setIndex] = useState<number>(0);
  const completed = useRef<boolean>(false);

  function advance() {
    setIndex(i => {
      const next = i + 1;
      if (next > lastIndex && !completed.current) {
        completed.current = true;
        onComplete?.();
      };
      return next;
    })
  };

  function reset() {
    completed.current = false;
    setIndex(0);
  };

  const currentLine = lines[index] || "";

  return {
    index, 
    currentLine,
    isDone: index > lastIndex,
    advance,
    reset
  }
};