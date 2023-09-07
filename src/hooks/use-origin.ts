'use client';
import { useEffect, useMemo, useState } from 'react';

const UseOrigin = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin: string | null =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  if (!mounted) return null;

  return origin;
};

export default UseOrigin;
