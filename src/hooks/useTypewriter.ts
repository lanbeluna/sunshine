import { useEffect, useState } from 'react';

export function useTypewriter(fullText: string, msPerChar = 28): string {
  const [state, setState] = useState(() => ({ text: fullText, len: 0 }));
  const len = state.text === fullText ? state.len : 0;

  useEffect(() => {
    if (!fullText) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= fullText.length) {
        window.clearInterval(id);
        setState({ text: fullText, len: fullText.length });
        return;
      }
      setState({ text: fullText, len: i });
    }, msPerChar);
    return () => window.clearInterval(id);
  }, [fullText, msPerChar]);

  return fullText.slice(0, len);
}
