import { useEffect, useState } from 'react';

export function useTypewriter(fullText: string, msPerChar = 28): string {
  const [len, setLen] = useState(0);

  useEffect(() => {
    setLen(0);
    if (!fullText) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= fullText.length) {
        window.clearInterval(id);
        setLen(fullText.length);
        return;
      }
      setLen(i);
    }, msPerChar);
    return () => window.clearInterval(id);
  }, [fullText, msPerChar]);

  return fullText.slice(0, len);
}
