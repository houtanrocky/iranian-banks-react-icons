import { useCallback, useEffect, useRef, useState } from 'react';

export function useClipboard() {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, []);
  const copy = useCallback(async (text: string) => {
    let next = 'Copied to clipboard.';
    try { await navigator.clipboard.writeText(text); }
    catch { next = 'Copy unavailable. Select and copy the code manually.'; }
    if (!mounted.current) return;
    clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(''), 4000);
  }, []);
  return { copy, message };
}
