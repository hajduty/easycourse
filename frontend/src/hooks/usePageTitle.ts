import { useEffect } from 'react';

export function usePageTitle(title: string | undefined, suffix: string = 'EasyCourse') {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${suffix}` : suffix;
    document.title = fullTitle;
  }, [title, suffix]);
}
